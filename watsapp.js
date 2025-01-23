const express = require("express");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const path = require("path");
const MessageLog = require("./model/message.model");
const { CODESTATUS } = require("./config/status");
const { SOCKET } = require("./config/socket");
const { io } = require("./app");

const router = express.Router();

// Static array of recipients
const RECIPIENTS = [
  { phoneNumber: "+917519064082", name: "User1" },
  { phoneNumber: "+916201991257", name: "User2" },
  { phoneNumber: "+916265266993", name: "User3" },
  // Add more recipients as needed
];

const sendRealStats = async () => {
  try {
    // Fetch required fields from the database
    const logs = await MessageLog.find({}).sort({ createdAt: -1 });
    const stats = await MessageLog.aggregate([
      {
        $group: {
          _id: "$status", // Group by the `status` field
          count: { $sum: 1 }, // Count the number of occurrences for each status
        },
      },
    ]);

    // Transform the result into an object with default values
    const statusCounts = {
      SUCCESS: 0,
      PENDING: 0,
      FAILED: 0,
      SKIPPED: 0,
      RETRY: 0,
    };

    stats.forEach(({ _id, count }) => {
      if (statusCounts.hasOwnProperty(_id)) {
        statusCounts[_id] = count;
      }
    });
    // io.emit(SOCKET.STREAM_DATA, { logs, statusCounts });
  } catch (error) {
    // io.emit(SOCKET.STREAM_ERROR, { message: error.message });
    throw new Error("Failed to fetch message logs");
  }
};

// Template function to generate message text
const createTemplate = (name) => {
  return `🎉 *YOU'RE ONE OF US NOW!* 🎉

Hey ${name}! How have you been?

As a token of appreciation for your association with us — here is a personal invitation to join our rewards club ❤️❤️❤️. Our club members get exclusive offers, early access to seasonal promotions, and many more exciting deals ⭐🎯.

Click on this link to become a member and win 100 reward points:
https://tinyurl.com/yepsw7dre

_Message sent with ♥️ from Our Team_`;
};

// Configuration
const CONFIG = {
  BATCH_SIZE: 20,
  MESSAGE_DELAY: 3000,
  BATCH_DELAY: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000,
  SEND_ONE_TIME: 1,
};

// WhatsApp client configuration
const client = new Client({
  puppeteer: {
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  authStrategy: new LocalAuth({ clientId: "LOCAL_ID" }),
});

// client.initialize();

// Event handlers
client.on("qr", (qr) => console.log("QR Code:", qr));
client.on("ready", () => console.log("WhatsApp Web is ready!"));

// Utility functions
const formatPhoneNumber = (phoneNumber) => phoneNumber.replace(/[\+\s]/g, "");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const insertLogsToDb = async (db, messageObj) => {
  try {
    await db.create(messageObj);
  } catch (error) {
    await db.create({
      ...messageObj,
      status: CODESTATUS.FAILED,
      reason: error.message,
    });
  }

  //   get data from databases
  // sendRealStats();
};

// const check = false;
// let ind = 0;

// if (check) {
//   [...new Array(500)].map(async (item, index) => {
//     const int = setInterval(async () => {
//       await insertLogsToDb(MessageLog, {
//         phoneNumber: `91${index + 2}34${index}32${index + 1}`,
//         status: [...Object.values(CODESTATUS)][4 % index],
//         reason: index % 2 == 0 ? "success" : "failed",
//         count: 1,
//       });
//     }, 1000);
//     ind++;

//     if (ind >= 500) {
//       clearInterval(int);
//     }
//   });
// }

// Send message with retry mechanism
async function sendMessageWithRetry(
  chatId,
  name,
  bannerMedia,
  audioMedia,
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
    if (retryCount < CONFIG.RETRY_ATTEMPTS) {
      console.log(`Retry attempt ${retryCount + 1} for ${chatId}`);
      await delay(CONFIG.RETRY_DELAY);
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
        retryCount + 1
      );
    }
    throw error;
  }
}

// Process messages in batches
async function processBatch(batch, bannerMedia, audioMedia, messageLogs) {
  for (const recipient of batch) {
    const { phoneNumber, name } = recipient;
    try {
      // add check if already exist in skip it
      const alreadyExist = await messageLogs.findOne({
        phoneNumber,
        status: CODESTATUS.SUCCESS,
      });
      if (alreadyExist && alreadyExist.count == CONFIG.SEND_ONE_TIME) {
        await insertLogsToDb({
          phoneNumber,
          status: CODESTATUS.SKIPPED,
          reason: `Already sended message for contact ${phoneNumber}`,
        });
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
        continue;
      }

      // Send message with banner and audio
      const result = await sendMessageWithRetry(
        chatId,
        name,
        bannerMedia,
        audioMedia
      );
      if (result) {
        await insertLogsToDb({
          phoneNumber: chatId,
          status: CODESTATUS.SUCCESS,
          reason: "Message sent successfully",
          count: 1,
        });
      }
      messageLogs.push({ phoneNumber, status: "Success" });
      await delay(CONFIG.MESSAGE_DELAY);
    } catch (error) {
      console.error(`Error sending message to ${phoneNumber}:`, error);
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
    }
  }
}

// Main route handler with proper response streaming
router.get("/send", async (req, res) => {
  // Set headers for proper streaming
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  const messageLogs = [];
  let processedCount = 0;

  try {
    // Load media files
    const bannerMedia = MessageMedia.fromFilePath(
      path.join(__dirname, "banner.jpg")
    );
    const audioMedia = MessageMedia.fromFilePath(path.join(__dirname, "c.mp3"));

    // Process static recipients array in batches
    for (let i = 0; i < RECIPIENTS.length; i += CONFIG.BATCH_SIZE) {
      const batch = RECIPIENTS.slice(i, i + CONFIG.BATCH_SIZE);
      await processBatch(batch, bannerMedia, audioMedia, messageLogs);
      processedCount += batch.length;

      // Send progress update with newline delimiter
      // stream with socket
      res.write(
        JSON.stringify({
          status: "Processing",
          processed: processedCount,
          total: RECIPIENTS.length,
        }) + "\n"
      );

      if (i + CONFIG.BATCH_SIZE < RECIPIENTS.length) {
        await delay(CONFIG.BATCH_DELAY);
      }
    }

    // Save logs to MongoDB
    await MessageLog.insertMany(messageLogs);

    // Send final response with newline
    // stream with socket

    res.write(
      JSON.stringify({
        status: "Completed",
        processed: processedCount,
        messageLogs,
      }) + "\n"
    );

    res.end();
  } catch (error) {
    console.error("Error in bulk processing:", error);
    // Send error response with newline
    // stream with socket
    res.write(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }) + "\n"
    );
    res.end();
  }
});

router.get("/logs", async (req, res) => {
  try {
    const logs = await MessageLog.find({}).sort({ createdAt: -1 });
    const stats = await MessageLog.aggregate([
      {
        $group: {
          _id: "$status", // Group by the `status` field
          count: { $sum: 1 }, // Count the number of occurrences for each status
        },
      },
    ]);
    // Transform the result into an object with default values
    const statusCounts = {
      success: 0,
      pending: 0,
      failed: 0,
      skipped: 0,
      retry: 0,
    };

    stats.forEach(({ _id, count }) => {
      if (statusCounts.hasOwnProperty(_id)) {
        statusCounts[_id] = count;
      }
    });
    res.status(200).json({
      logs,
      statusCounts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = router;
