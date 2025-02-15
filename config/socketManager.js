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
    if (!client) {
      io.emit(SOCKET.WATSAPP_DISCONNECTED, {
        disconnected: true,
        message: "watsapp not connected",
      });
    }

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
  if (io) {
    io.emit("message", msg);
  }
};
const emitIOMessageStats = (msg) => {
  if (io) {
    io.emit("listen_message", msg);
  }
};
const emitIOCreditLimitStats = (msg) => {
  if (io) {
    io.emit("update_credit", msg);
  }
};
// @initialize it when start from client side
module.exports = {
  initSocket,
  getIO,
  emitIOMessage,
  emitIOMessageStats,
  emitIOCreditLimitStats,
};
