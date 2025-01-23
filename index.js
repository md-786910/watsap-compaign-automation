const { server, app, io } = require("./app");
// const SocketManager = require("./config/socketManager");
const mongoose = require("mongoose");
const router = require("./watsapp");

// const socketManager = new SocketManager(server);
// const io = socketManager.getIo();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

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

app.use("/api", router);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server running on port ${PORT}`);
});
