require("dotenv").config();
const { dbConnect } = require("./config/connection");
// const { initSocket } = require("./config/socketManager");
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const watsappRouter = require("./routes/watsappRoute");
const generalRouter = require("./routes/generalRoutes");
const { initSocket, getIO } = require("./config/socketManager");

const router = express.Router();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// errorHandler.js
const errorHandler = (err, req, res, next) => {
  const errorInfo = {
    success: false,
    message: err.message || "Internal Server Error",
    status: err.status || 500,
    stack: err.stack, // Captures the file, line number, and full trace
  };

  res.status(errorInfo.status).json(errorInfo);
};

app.use("/api/v1", router);

// Defined router for application
router.use(watsappRouter);
router.use(generalRouter);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  // Initialize socket.io
  await initSocket(server);
  await dbConnect();

  console.log(`Server running on port ${PORT}`);
});

// Unknown Route Handler
app.use((req, res, next) => {
  next(new Error("Route Not Found", 404));
});

app.use(errorHandler); // Place at the end after all routes

process.on("uncaughtException", (err) => {
  console.error(`[Uncaught Exception]: ${err.message}`);
  // Optional: Shut down gracefully
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`[Unhandled Rejection]: ${reason}`);
  // Optional: Shut down gracefully
});
