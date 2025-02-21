const { getIO } = require("../config/socketManager");
const {
  initializeClientWebjs,
  disconnectClient,
  getClient,
} = require("../config/watsappConfig");
const { SOCKET } = require("../constant/socket");
const processedSheet = require("../model/processed_sheet.model");
const WatsappBatch = require("../model/watsap_batch.model");
const WatsappSession = require("../model/watsap_session.model");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const path = require("path");
const ProcessSheetManager = require("../utils/processSheetData");
const { cleanupFile, fileNameSave } = require("../helper/multer");
const Template = require("../model/template.model");
const fs = require("fs").promises;
const qrcode = require("qrcode-terminal");
const initRedis = require("../worker/initRedis");

const redis = initRedis;


exports.connectedToWatsapp = CatchAsync(async (req, res, next) => {
  const existingClient = getClient();
  const userId = req.user?._id;

  try {
    if (existingClient) {
      existingClient.destroy();
    }
    // Get IO instance
    const io = getIO();
    const { session_id } = req.body;

    // Check if session_id is provided
    if (!session_id) {
      return next(new AppError("Session ID is required", 400)); // 400 Bad Request is more appropriate
    }

    // Initialize the WhatsApp client
    const client = await initializeClientWebjs(session_id);

    // Check if session exists in the database, if not, create it
    const session = await WatsappSession.findOne({ userId, session_id });
    if (!session) {
      await WatsappSession.create({
        userId,
        session_id,
        phone_number: client.info?.wid?.user,
        device: client.info?.platform,
        status: "active",
        user: client.info?.pushname,
      });
    }
    // @UPDATE SESSION TO BE INACTIVE
    await WatsappSession.updateMany({
      userId,
      status: "inactive",
    });

    // Handle QR code event
    client.on("qr", (qr) => {
      console.log("QR Code received. Waiting for scan...");
      qrcode.generate(qr, { small: true }); // Display QR code in terminal
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "please scan the QR code",
        status: "waiting_for_qr",
        qr: qr, // Optionally send the QR code data if needed
        connecting: true,
      });
    });

    // Handle ready event
    client.on("ready", async () => {
      console.log("WhatsApp Web is ready!");
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "connected to whatsApp successfully",
        status: "connected",
        connecting: false,
      });
      await WatsappSession.findOneAndUpdate(
        { session_id },
        {
          $set: {
            status: "active",
            user: client.info?.pushname,
            phone_number: client.info?.wid?.user,
            device: client.info?.platform,
            userId,
          },
        },
        { new: true, upsert: true } // Return the updated document
      );
      session.status = "active";
      session.user = client.info?.pushname;
      session.phone_number = client.info?.wid?.user;
      session.device = client.info?.platform;
      session.userId = userId;
      await session.save();
    });

    // Handle authentication failure
    client.on("auth_failure", (msg) => {
      console.error("Authentication failed:", msg);
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "whatsApp authentication failed",
        status: "auth_failed",
        error: msg,
        connecting: true,
      });
    });

    // Handle disconnection
    client.on("disconnected", (reason) => {
      console.log("Client was logged out:", reason);
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "ahatsApp disconnected",
        status: "disconnected",
        reason: reason,
        connecting: true,
      });
    });

    // Initialize the client
    client.initialize();

    // Send an initial response to the HTTP request
    res.status(200).json({
      message: "WhatsApp client initialization started connecting...",
      status: "initializing",
    });
  } catch (error) {
    console.error("Error initializing WhatsApp:", error);
    res.status(500).json({
      message: "Something went wrong",
      status: "error",
      error: error.message,
    });
  }
});

exports.disconnectedFromWatsapp = CatchAsync(async (req, res, next) => {
  await WatsappSession.updateMany({
    status: "inactive",
  });
  disconnectClient();
  res.status(200).json({
    message: "watsapp disconnected successfully",
    status: true,
  });
});

exports.getAllSession = CatchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const sessions = await WatsappSession.find({ userId }).sort({
    createdAt: -1,
  });
  res.status(200).json({
    message: "sessions fetched successfully",
    status: true,
    data: sessions,
  });
});

exports.deleteSession = CatchAsync(async (req, res, next) => {
  const { session_id } = req.params;
  const userId = req.user?._id;
  if (!session_id) {
    return next(new AppError("session is required", 200));
  }
  const session = await WatsappSession.findOne({
    userId,
    session_id,
  });
  if (!session) {
    return next(new AppError("session not found", 200));
  }

  const folderName = session.folder;
  // @delete from folder aslo
  const folderPath = path.join(
    __dirname,
    "..",
    folderName,
    "session-" + session_id
  );
  // Ensure file exists before deleting
  await fs.access(folderPath);
  await fs.rm(folderPath, { recursive: true, force: true });
  await WatsappSession.findOneAndDelete({ userId, session_id });
  res.status(200).json({
    message: "session deleted successfully",
    status: true,
  });
});

exports.createWatsappBatch = CatchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("Req body is required", 200));
  }
  const { batch_size, message_delay, batch_delay } = req.body;
  const userId = req.user?._id;
  const batch = await WatsappBatch.findOne({ userId });
  if (!batch) {
    // create
    await WatsappBatch.create({
      userId,
      batch_size,
      message_delay,
      batch_delay,
    });
  } else {
    // @update
    await WatsappBatch.updateOne(
      { _id: batch._id, userId },
      {
        batch_size,
        message_delay,
        batch_delay,
        userId,
      }
    );
  }
  res.status(200).json({
    message: "batch created successfully",
    status: true,
  });
});

exports.getWatsapBatch = CatchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const batch = await WatsappBatch.findOne({ userId });
  res.status(200).json({
    message: "batch fetched successfully",
    status: true,
    data: batch,
  });
});

// @process sheet
exports.processSheet = CatchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Sheet is required", 200));
  }
  const userId = req.user?._id;
  // @clear sheet model
  await processedSheet.deleteMany({ userId });
  // end

  const { originalname, path, mimetype } = req.file;
  let extractedData = [];
  const proccesSheetClass = new ProcessSheetManager(path);
  if (mimetype === "text/csv") {
    extractedData = await proccesSheetClass.parseCSV(path);
  } else if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimetype === "application/vnd.ms-excel"
  ) {
    extractedData = await proccesSheetClass.parseExcel(path);
  } else if (mimetype === "application/pdf") {
    extractedData = await proccesSheetClass.parsePDF(path);
  } else {
    return res.status(400).json({ error: "Unsupported file format" });
  }

  if (extractedData.length == 0) {
    cleanupFile(path);
  }

  // @insrting in db
  for (const data of extractedData) {
    if (
      await processedSheet.findOne({
        userId,
        phone_number: `+91${data.phone_number}`,
      })
    ) {
      continue;
    }

    const phoneNumberProcess = String(data?.phone_number || "").startsWith(
      "+91"
    )
      ? String(data.phone_number)
      : `+91${data.phone_number}`;

    await processedSheet.create({
      userId,
      name: data.name,
      phone_number: phoneNumberProcess,
      fileName: originalname,
    });
  }

  // Delete the uploaded file
  cleanupFile(path);
  res.json({
    message: "File uploaded & processed successfully",
    data: extractedData,
  });
});

exports.getSheet = CatchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const sheet = await processedSheet.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({
    message: "sheet fetched successfully",
    status: true,
    data: sheet,
  });
});

exports.deleteSheet = CatchAsync(async (req, res, next) => {
  //@delete all
  const userId = req.user?._id;
  await processedSheet.deleteMany({ userId });
  res.status(200).json({
    message: "sheet deleted successfully",
    status: true,
  });
});

// Create or Update Template
exports.createTemplate = CatchAsync(async (req, res, next) => {
  const { name, content, isDefault } = req.body;
  const userId = req.user?._id;
  // Validate required fields
  if (!name || !content) {
    return next(new AppError("Name and content are required", 400)); // Changed status code to 400 for bad request
  }

  // Extract file URLs from request files
  let { imageUrl, documentUrl, audioUrl } = req.files;
  // imageUrl = imageUrl?.startsWith("http") ? imageUrl : fs.wr;

  const fileObj = {
    imageUrl: imageUrl?.[0]?.path ?? null,
    documentUrl: documentUrl?.[0]?.path ?? null,
    audioUrl: audioUrl?.[0]?.path ?? null,
    imageName: (imageUrl && fileNameSave(imageUrl[0])) ?? null,
    audioName: (audioUrl && fileNameSave(audioUrl[0])) ?? null,
    documentName: (documentUrl && fileNameSave(documentUrl[0])) ?? null,
  };

  // Check if template already exists
  let template = await Template.findOne({ userId, name });

  if (template) {
    // Update existing template
    template = await Template.findOneAndUpdate(
      { _id: template._id, userId },
      { $set: { userId, name, content, isDefault, ...fileObj } },
      { new: true, upsert: true } // Return the updated document
    );
  } else {
    // Create new template
    await Template.updateMany({ userId, isDefault: false });
    template = await Template.create({ userId, name, content, ...fileObj });
  }

  // Send response
  res.status(200).json({
    message: "Template created/updated successfully",
    status: true,
    data: template,
  });
});

// Get All Templates
exports.getTemplates = CatchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const templates = await Template.findOne({ userId }).sort({ createdAt: -1 });
  res.status(200).json({
    message: "Templates fetched successfully",
    status: true,
    data: templates,
  });
});
