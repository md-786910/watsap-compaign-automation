require("dotenv").config();
const { dbConnect } = require("./config/connection");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

const watsappRouter = require("./routes/watsappRoute");
const generalRouter = require("./routes/generalRoutes");
const { initSocket, getIO, emitToUser } = require("./config/socketManager");
const fileRouter = require("./routes/file.route");
const { disconnectClient } = require("./config/watsappConfig");
const WatsappSession = require("./model/watsap_session.model");
const userRoute = require("./routes/user.route");
const { authenticateUser } = require("./helper/auth");
const { messageQueue } = require("./worker/queue");
const { QUEUE_NAME } = require("./config/appconfig");
const { SOCKET } = require("./constant/socket");

// ✅ Middleware for JSON and Form Data Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS Configuration
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Move static path serving **ABOVE** the API routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Static folder path:", path.join(__dirname, "uploads"));

const router = express.Router();

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// for (let i = 0; i < 200; i++) {
//   messageQueue.add(QUEUE_NAME, {
//     id: i + 1,
//     name: "ashif " + i,
//   });
// }

// ✅ Mount API routes
app.use("/api/v1", router);

// authorize router
router.use(authenticateUser);

router.use("/", watsappRouter);
router.use("/", generalRouter);
router.use("/auth", userRoute);
router.use("/file", fileRouter);

// ✅ Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.log({ err });
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
    status: err.status || "error",
    stack: err.stack,
  });
};

// ✅ Unknown Route Handler (Must be after all valid routes)
app.use((req, res, next) => {
  next(new Error("Route Not Found", 404));
});

// ✅ Use the error handler
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await initSocket(server);
  await dbConnect();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  require("./worker/worker");
});

// ✅ Graceful Error Handling
process.on("uncaughtException", (err) => {
  console.log(`[Uncaught Exception]: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`[Unhandled Rejection]: ${reason}`);
});

// Listen for nodemon restart event
process.once("SIGUSR2", async () => {
  // @clear client
  await WatsappSession.updateMany({ status: "inactive" });
  disconnectClient();
  //update session
  process.kill(process.pid, "SIGUSR2");

  server.close(() => {
    console.log("Server closed");
    process.kill(process.pid, "SIGUSR2");
  });
});

process.once("SIGTERM", async () => {
  try {
    console.log("Shutting down...");

    // Update database before shutdown
    const data = await WatsappSession.updateMany({ status: "inactive" });
    console.log("Sessions updated:", data);

    disconnectClient(); // Ensure cleanup completes

    server.close(() => {
      console.log("Server closed");
      process.exit(0); // Properly exit the process
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// Handle other termination signals
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.once(signal, async () => {
    console.log(`Received ${signal} - Starting graceful shutdown`);
    try {
      disconnectClient();
      process.exit(0);
    } catch (error) {
      console.error(`Error during ${signal} shutdown:`, error);
      process.exit(1);
    }
  });
});
