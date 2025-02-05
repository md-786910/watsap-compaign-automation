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
const { initSocket } = require("./config/socketManager");
const fileRouter = require("./routes/file.route");
const { disconnectClient } = require("./config/watsappConfig");
const WatsappSession = require("./model/watsap_session.model");

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

// ✅ Mount API routes
app.use("/api/v1", router);
router.use(watsappRouter);
router.use(generalRouter);
router.use("/file", fileRouter);

// ✅ Global Error Handler
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    status: err.status || 500,
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
});

// ✅ Graceful Error Handling
process.on("uncaughtException", (err) => {
  console.error(`[Uncaught Exception]: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`[Unhandled Rejection]: ${reason}`);
});

// Listen for nodemon restart event
process.once("SIGUSR2", () => {
  // @clear client
  WatsappSession.updateMany({ status: "inactive" }).then((data) => {
    console.log(data);
  });
  disconnectClient();
  console.log("coieqwuoeq oweiqy ioryiowyrowyiroy oiewyroiweyoriyweio yrowey");
  //update session

  // server.close(() => {
  //   console.log('Server closed');
  //   process.kill(process.pid, 'SIGUSR2');
  // });
});
