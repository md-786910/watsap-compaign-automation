const { processBatch, BATCH_CONFIG } = require("../helper/batch");
const MessageLog = require("../model/message.model");
const { MessageMedia } = require("whatsapp-web.js");
const path = require("path");
const { delay, RECIPIENTS } = require("../utils/common");
const { emitIOMessage } = require("../config/socketManager");
const { getClient } = require("../config/watsappConfig");
const processedSheet = require("../model/processed_sheet.model");
const Template = require("../model/template.model");
const { countCreditLeft } = require("../utils/credit");

exports.LoadCampaingAndStarted = async (req, res, next) => {
  const client = getClient();
  // Check if client is ready
  if (!client) {
    emitIOMessage(
      "WhatsApp client not connected. Please scan QR code or wait for connection"
    );
    return res.status(503).json({
      message:
        "Please connect to WhatsApp client for sending message. Not connected",
      status: false,
    });
  }

  // Check credit left or not
  const isCreditLeft = await countCreditLeft(req.user?._id);
  if (!isCreditLeft) {
    emitIOMessage("You have no credit left");
    return res.status(404).json({
      message: "You have no credit left. Please buy credit",
      status: false,
    });
  }

  /*
  1.check : Template is available(content,(Optional[Audio,documents,images]))
  2. Check Sheet is available with min count is 1
  */
  const template = await Template.findOne({ isDefault: true });
  if (!template) {
    return res.status(200).json({
      message: "Please create template first",
      status: false,
    });
  }

  const RECIPIENTS = await processedSheet.find({});
  if (RECIPIENTS?.length === 0) {
    return res.status(200).json({
      message: "Please upload sheet to sending message",
      status: false,
    });
  }

  // @load file
  let bannerMedia = null;
  let audioMedia = null;
  let documentMedia = null;
  if (template?.imageName) {
    bannerMedia = MessageMedia.fromFilePath(
      path.join(__dirname, "../uploads/", template.imageName)
    );
  }
  if (template?.audioName) {
    audioMedia = MessageMedia.fromFilePath(
      path.join(__dirname, "../uploads/", "audio.mp3")
    );
  }
  if (template?.documentName) {
    documentMedia = MessageMedia.fromFilePath(
      path.join(__dirname, "../uploads/", "doc.pdf")
    );
  }

  const messageContent = template?.content;

  // Set headers for proper streaming
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  emitIOMessage("App started");
  const messageLogs = [];
  let processedCount = 0;
  try {
    // Process static recipients array in batches
    emitIOMessage(
      "Start defining batch for reciepent of size " + BATCH_CONFIG.BATCH_SIZE
    );

    for (let i = 0; i < RECIPIENTS.length; i += BATCH_CONFIG.BATCH_SIZE) {
      let batch = RECIPIENTS.slice(i, i + BATCH_CONFIG.BATCH_SIZE);
      batch = batch.map((bat) => ({
        id: bat._id,
        name: bat.name,
        phoneNumber: bat.phone_number,
      }));
      await processBatch({
        batch,
        bannerMedia,
        audioMedia,
        documentMedia,
        messageLogs,
        messageContent,
        userId: req.user?._id,
      });
      processedCount += batch.length;
      emitIOMessage(
        "Processing " + processedCount + " of " + RECIPIENTS.length
      );

      // Send progress update with newline delimiter
      // stream with socket
      res.write(
        JSON.stringify({
          status: "Processing",
          processed: processedCount,
          total: RECIPIENTS.length,
        }) + "\n"
      );

      if (i + BATCH_CONFIG.BATCH_SIZE < RECIPIENTS.length) {
        await delay(BATCH_CONFIG.BATCH_DELAY);
      }
    }
    // Send final response with newline
    // stream with socket
    res.write(
      JSON.stringify({
        status: "Completed",
        processed: processedCount,
        total: RECIPIENTS.length,
      }) + "\n"
    );

    res.end(); // Properly end the response
    emitIOMessage("Send to all watsapp message completed");
  } catch (error) {
    console.error("Error in bulk processing:", error);
    // Send error response with newline
    // stream with socket
    emitIOMessage("Error comming " + error?.message);
    res.write(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }) + "\n"
    );
    res.end();
    emitIOMessage("Send to all watsapp message completed");
  }
};

exports.getWatsappCompaign = async (req, res) => {
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
};
