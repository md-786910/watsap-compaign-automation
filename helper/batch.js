const { CODESTATUS } = require("../config/status");
const { formatPhoneNumber, insertLogsToDb, delay } = require("../utils/common");
const MessageLog = require("../model/message.model");
const {
  emitIOMessage,
  getIO,
  emitIOMessageStats,
  emitIOCreditLimitStats,
} = require("../config/socketManager");
const { getClient } = require("../config/watsappConfig");
const { countCreditLeft } = require("../utils/credit");
const User = require("../model/user.model");
// Configuration
const BATCH_CONFIG = {
  BATCH_SIZE: 20,
  MESSAGE_DELAY: 3000,
  BATCH_DELAY: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000,
  SEND_ONE_TIME_COUNT: 2, //!@ At MAX 2 times
};
let messageCount = 1;
// Send message with retry mechanism
async function sendMessageWithRetry({
  chatId,
  name,
  bannerMedia,
  audioMedia,
  documentMedia,
  client,
  messageContent,
  retryCount = 0,
}) {
  try {
    // Send template with banner
    const messageText = messageContent;
    if (bannerMedia) {
      await client.sendMessage(chatId, bannerMedia, {
        caption: messageText,
        linkPreview: true,
      });
    } else {
      await client.sendMessage(chatId, messageText);
    }

    // Wait briefly before sending audio
    await delay(1000);

    // Send audio file
    if (audioMedia) {
      await client.sendMessage(chatId, audioMedia);
    }
    if (documentMedia) {
      await client.sendMessage(chatId, documentMedia);
    }

    return true;
  } catch (error) {
    if (retryCount < BATCH_CONFIG.RETRY_ATTEMPTS) {
      console.log(`Retry attempt ${retryCount + 1} for ${chatId}`);
      await delay(BATCH_CONFIG.RETRY_DELAY);
      await insertLogsToDb({
        phoneNumber: chatId,
        status: CODESTATUS.RETRY,
        reason: `Retrying for contact ${chatId}`,
      });
      return sendMessageWithRetry({
        chatId,
        name,
        bannerMedia,
        audioMedia,
        documentMedia,
        client,
        messageContent,
        retryCount: retryCount + 1,
      });
    }
    throw error;
  }
}

// Process messages in batches
async function processBatch({
  batch,
  bannerMedia,
  audioMedia,
  documentMedia,
  messageLogs = [],
  messageContent,
  userId,
}) {
  const client = getClient();
  if (!client) {
    throw new Error("WhatsApp client not connected");
  }
  for (const recipient of batch) {
    emitIOMessage(`Reaading phone number ${recipient.phoneNumber}`);
    const { phoneNumber, name } = recipient;
    try {
      // add check if already exist in skip it
      const alreadyExist = await MessageLog.findOne({
        phoneNumber,
        status: CODESTATUS.SUCCESS,
      });
      emitIOMessage(
        `Checking phone number already exist ${recipient.phoneNumber}`
      );

      if (
        alreadyExist &&
        alreadyExist.count == BATCH_CONFIG.SEND_ONE_TIME_COUNT
      ) {
        await insertLogsToDb({
          phoneNumber,
          status: CODESTATUS.SKIPPED,
          reason: `Already sended message for contact ${phoneNumber}`,
        });
        emitIOMessage(`Skipping ${recipient.phoneNumber}`);
        continue;
      }

      if (!phoneNumber.startsWith("+91") || phoneNumber == "+91N/A") {
        await insertLogsToDb({
          phoneNumber,
          status: CODESTATUS.FAILED,
          reason: "Non-Indian phone number",
        });
        emitIOMessage(`Skipping not indian number ${recipient.phoneNumber}`);

        continue;
      }

      const formattedNumber = formatPhoneNumber(phoneNumber);
      const chatId = `${formattedNumber}@c.us`;

      // Verify WhatsApp registration
      const numberExists = await client.isRegisteredUser(chatId);
      if (!numberExists) {
        await insertLogsToDb({
          phoneNumber,
          status: CODESTATUS.SKIPPED,
          reason: "Number not registered on WhatsApp",
        });
        emitIOMessage(
          `Skipping not registered on watsapp ${recipient.phoneNumber}`
        );
        continue;
      }

      // Send message with banner and audio
      const result = await sendMessageWithRetry({
        chatId,
        name,
        bannerMedia,
        audioMedia,
        documentMedia,
        client,
        messageContent,
      });
      if (result) {
        messageCount++;
        await insertLogsToDb({
          phoneNumber: chatId,
          status: CODESTATUS.SUCCESS,
          reason: "Message sent successfully",
          count: 1,
        });
        emitIOMessageStats(
          `${messageCount} message sent : ${recipient.phoneNumber}`
        );

        // check credit left or not
        const isCreditLeft = await countCreditLeft(userId);
        if (!isCreditLeft) {
          emitIOMessageStats(`credit limit exceeded`);
          return;
        }
        // update credit count
        const credit = await User.updateOne(
          { _id: userId },
          {
            $inc: {
              used_credit: 1, // Increment used_credit by 1
              remaining_credit: -1, // Decrement remaining_credit by 1
            },
          },
          { new: true }
        );

        // update reamining count
        emitIOCreditLimitStats(credit?.remaining_credit);
      }
      await delay(BATCH_CONFIG.MESSAGE_DELAY);
    } catch (error) {
      await insertLogsToDb({
        phoneNumber: phoneNumber,
        status: CODESTATUS.FAILED,
        reason: error.message,
      });
      emitIOMessage(`error ${error.message} for ${recipient.phoneNumber}`);
      throw error;
    }
  }
}

module.exports = {
  sendMessageWithRetry,
  processBatch,
  BATCH_CONFIG,
};
