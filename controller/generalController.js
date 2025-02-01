const { getIO } = require("../config/socketManager");
const {
  initializeClientWebjs,
  disconnectClient,
} = require("../config/watsappConfig");
const { SOCKET } = require("../constant/socket");
const WatsappSession = require("../model/watsap_session.model");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const path = require("path");
const fs = require("fs").promises;
exports.connectedToWatsapp = CatchAsync(async (req, res, next) => {
  try {
    // Get IO instance
    const io = getIO();
    const { session_id } = req.body;

    // Check if session_id is provided
    if (!session_id) {
      return next(new AppError("Session ID is required", 400)); // 400 Bad Request is more appropriate
    }

    // Check if session exists in the database, if not, create it
    if (!(await WatsappSession.findOne({ session_id }))) {
      await WatsappSession.create({ session_id });
    }

    // Initialize the WhatsApp client
    const client = await initializeClientWebjs(session_id);

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
    client.on("ready", () => {
      console.log("WhatsApp Web is ready!");
      io.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "connected to whatsApp successfully",
        status: "connected",
      });
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
