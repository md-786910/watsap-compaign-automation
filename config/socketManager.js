// socket.js
const { Server } = require("socket.io");
const { SOCKET } = require("../constant/socket");
const { getClient } = require("./watsappConfig");
let io;
const initSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const client = getClient();
    if (client) {
      socket.emit(SOCKET.WATSAPP_CONNECTED, {
        message: "connected to whatsApp successfully",
        status: "connected",
      });
    }

    socket.on("watsapp_disconnected", (data) => {
      socket.emit(SOCKET.WATSAPP_DISCONNECTED, {
        message: "whatsApp diconnected",
        status: "disconnected",
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket first.");
  }
  return io;
};

const emitIOMessage = (msg) => {
  // const io = getIO();
  if (io) {
    io.emit(SOCKET.MESSAGE, msg);
  }
};
// @initialize it when start from client side

module.exports = { initSocket, getIO, emitIOMessage };
