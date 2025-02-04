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
exports.connectedToWatsapp = CatchAsync(async (req, res, next) => {
  const existingClient = getClient();
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
    const session = await WatsappSession.findOne({ session_id });
    if (!session) {
      await WatsappSession.create({
        session_id,
        phone_number: client.info?.wid?.user,
        device: client.info?.platform,
        status: "active",
        user: client.info?.pushname,
      });
    }
    // @UPDATE SESSION TO BE INACTIVE
    await WatsappSession.updateMany({
      status: "inactive",
    });

    // Handle QR code event
    client.on("qr", (qr) => {
      console.log("QR Code received. Waiting for scan...");
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "please scan the QR code",
        status: "waiting_for_qr",
        qr: qr, // Optionally send the QR code data if needed
      });
    });

    // Handle ready event
    client.on("ready", async () => {
      console.log("WhatsApp Web is ready!");
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "connected to whatsApp successfully",
        status: "connected",
      });
      if (!session) {
        session.status = "active";
        session.user = client.info?.pushname;
        session.phone_number = client.info?.wid?.user;
        session.device = client.info?.platform;
        await session.save();
      } else {
        //@update only session
        session.status = "active";
        session.user = client.info?.pushname;
        session.phone_number = client.info?.wid?.user;
        session.device = client.info?.platform;
        await session.save();
      }
    });

    // Handle authentication failure
    client.on("auth_failure", (msg) => {
      console.error("Authentication failed:", msg);
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "whatsApp authentication failed",
        status: "auth_failed",
        error: msg,
      });
    });

    // Handle disconnection
    client.on("disconnected", (reason) => {
      console.log("Client was logged out:", reason);
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "ahatsApp disconnected",
        status: "disconnected",
        reason: reason,
      });
    });

    // Initialize the client
    client.initialize();

    // Send an initial response to the HTTP request
    res.status(200).json({
      message: "WhatsApp client initialization started",
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
  const sessions = await WatsappSession.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    message: "sessions fetched successfully",
    status: true,
    data: sessions,
  });
});

exports.deleteSession = CatchAsync(async (req, res, next) => {
  const { session_id } = req.params;
  if (!session_id) {
    return next(new AppError("session is required", 200));
  }
  const session = await WatsappSession.findOne({ session_id });
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
  await WatsappSession.findOneAndDelete({ session_id });
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
  console.log(req.body);
  const batch = await WatsappBatch.findOne({});
  console.log({ batch });
  if (!batch) {
    // create
    await WatsappBatch.create({
      batch_size,
      message_delay,
      batch_delay,
    });
  } else {
    // @update
    await WatsappBatch.updateOne(
      { _id: batch._id },
      {
        batch_size,
        message_delay,
        batch_delay,
      }
    );
  }
  res.status(200).json({
    message: "batch created successfully",
    status: true,
  });
});

exports.getWatsapBatch = CatchAsync(async (req, res, next) => {
  const batch = await WatsappBatch.findOne({});
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

  // @clear sheet model
  await processedSheet.deleteMany({});
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
      await processedSheet.findOne({ phone_number: `+91${data.phone_number}` })
    ) {
      console.log("Skipping, already exists", data);
      continue;
    }

    const phoneNumberProcess = String(data?.phone_number || "").startsWith(
      "+91"
    )
      ? String(data.phone_number)
      : `+91${data.phone_number}`;

    await processedSheet.create({
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
  const sheet = await processedSheet.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    message: "sheet fetched successfully",
    status: true,
    data: sheet,
  });
});

// Create or Update Template
exports.createTemplate = CatchAsync(async (req, res, next) => {
  const { name, content } = req.body;
  if (!name || !content) {
    return next(new AppError("Name and content are required", 200));
  }
  const { imageUrl = null, documentUrl = null, audioUrl = null } = req.files;
  console.log({ imageUrl, documentUrl, audioUrl });

  const getTemplateExist = await Template.findOne({ name });
  let template = getTemplateExist;
  const fileObj = {
    imageUrl: imageUrl?.[0]?.path,
    documentUrl: documentUrl?.[0]?.path,
    audioUrl: audioUrl?.[0]?.path,
    imageName: imageUrl && fileNameSave(imageUrl?.[0]),
    audioName: audioUrl && fileNameSave(audioUrl?.[0]),
    documentName: documentUrl && fileNameSave(documentUrl?.[0]),
  };
  if (!getTemplateExist) {
    template = await Template.create({
      name,
      content,
      ...fileObj,
    });
  } else {
    //@update
    console.log({ template });
    const fileObj = {
      name,
      content,
      imageUrl: imageUrl?.[0]?.path || template.imageUrl,
      documentUrl: documentUrl?.[0]?.path || template.documentUrl,
      audioUrl: audioUrl?.[0]?.path || template.audioUrl,
      imageName: imageUrl ? fileNameSave(imageUrl?.[0]) : template.imageName,
      audioName: audioUrl ? fileNameSave(audioUrl?.[0]) : template.audioName,
      documentName: documentUrl
        ? fileNameSave(documentUrl?.[0])
        : template.documentName,
    };
    template = await Template.findOneAndUpdate(
      { _id: getTemplateExist._id },
      {
        name,
        content,
        ...fileObj,
      }
    );
  }
  res.status(200).json({
    message: "Template created successfully",
    status: true,
    data: template,
  });
});

// Get All Templates
exports.getTemplates = CatchAsync(async (req, res, next) => {
  const templates = await Template.findOne({}).sort({ createdAt: -1 });
  res.status(200).json({
    message: "Templates fetched successfully",
    status: true,
    data: templates,
  });
});
