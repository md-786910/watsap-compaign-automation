const { dbConnect } = require("./config/connection");
const { initSocket } = require("./config/socketManager");
const express = require("express");
const http = require("http");
const cors = require("cors");
const router = require("./routes/watsappRoute");
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(`[Error]: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

app.use(errorHandler); // Place at the end after all routes

app.use("/api", router);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  // Initialize socket.io
  await initSocket(server);
  await dbConnect();
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error(`[Uncaught Exception]: ${err.message}`);
  // Optional: Shut down gracefully
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`[Unhandled Rejection]: ${reason}`);
  // Optional: Shut down gracefully
});
