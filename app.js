const express = require("express");
const app = express();
const http = require("http");
const SocketManager = require("./config/socketManager");
const { default: mongoose } = require("mongoose");
const server = http.createServer(app);

const socketManager = new SocketManager(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// @connect to db
const dbConnect = async () => {
  try {
    // MongoDB connection
    mongoose.connect("mongodb://localhost:27017/whatsappAutomation", {});
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    throw new Error(error.mesage);
  }
};

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
