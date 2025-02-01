const { CODESTATUS } = require("../config/status");
const { createTemplate } = require("../template/watsapTemplate");
const { formatPhoneNumber, insertLogsToDb, delay } = require("../utils/common");
const MessageLog = require("../model/message.model");
const { emitIOMessage } = require("../config/socketManager");
const { getClient } = require("../config/watsappConfig");
// Configuration
const BATCH_CONFIG = {
  BATCH_SIZE: 20,
  MESSAGE_DELAY: 3000,
  BATCH_DELAY: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000,
  SEND_ONE_TIME_COUNT: 2, //!@ At MAX 2 times
};
// Send message with retry mechanism
async function sendMessageWithRetry(
  chatId,
  name,
  bannerMedia,
  audioMedia,
  client,
  retryCount = 0
) {
  try {
    // Send template with banner
    const messageText = createTemplate(name);
    await client.sendMessage(chatId, bannerMedia, {
      caption: messageText,
      linkPreview: true,
    });

    // Wait briefly before sending audio
    await delay(1000);

    // Send audio file
    await client.sendMessage(chatId, audioMedia);

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
      return sendMessageWithRetry(
        chatId,
        name,
        bannerMedia,
        audioMedia,
        client,
        retryCount + 1
      );
    }
    throw error;
  }
}

// Process messages in batches
async function processBatch(batch, bannerMedia, audioMedia, messageLogs) {
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

      if (!phoneNumber.startsWith("+91")) {
        messageLogs.push({
          phoneNumber,
          status: CODESTATUS.FAILED,
          reason: "Non-Indian phone number",
        });
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
        messageLogs.push({
          phoneNumber,
          status: "Skipped",
          reason: "Number not registered on WhatsApp",
        });
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
      const result = await sendMessageWithRetry(
        chatId,
        name,
        bannerMedia,
        audioMedia,
        client
      );
      if (result) {
        await insertLogsToDb({
          phoneNumber: chatId,
          status: CODESTATUS.SUCCESS,
          reason: "Message sent successfully",
          count: 1,
        });
        emitIOMessage(`Message send Success to ${recipient.phoneNumber}`);
      }
      messageLogs.push({ phoneNumber, status: "success" });
      await delay(BATCH_CONFIG.MESSAGE_DELAY);
    } catch (error) {
      messageLogs.push({
        phoneNumber,
        status: "Error",
        error: error.message,
      });
      await insertLogsToDb({
        phoneNumber: phoneNumber,
        status: CODESTATUS.FAILED,
        reason: error.message,
      });
      emitIOMessage(`error ${error.message} for ${recipient.phoneNumber}`);
    }
  }
}

module.exports = {
  sendMessageWithRetry,
  processBatch,
  BATCH_CONFIG,
};
