// socket.js
const { Server } = require("socket.io");
const { SOCKET } = require("../constant/socket");
const { getClient } = require("./watsappConfig");

let io;
const socketToUserId = new Map(); // socket.id -> userId
const userIdToSocket = {}; // userId -> socket.id

const initSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: true, // Restrict in production
      methods: ["GET", "POST", "DELETE"],
    },
  });

  io.on("connection", async (socket) => {
    console.log(
      "A user connected",
      socket.id,
      "Query:",
      socket.handshake.query
    );
    const userId = socket.handshake.query.userId;
    const session_id = socket.handshake.query.session_id;

    if (userId) {
      // Map socket to userId
      socketToUserId.set(socket.id, userId);
      // userIdToSocket.set(userId, socket.id);
      userIdToSocket[userId] = socket.id;
      console.log(`Mapped socket ${socket.id} to userId ${userId}`);

      // Optionally still use rooms for broadcasting if needed
      socket.join(userId);
    } else {
      console.warn("No userId provided in handshake");
    }

    const socketId = userIdToSocket[userId];
    if (session_id) {
      const client = getClient(session_id);
      // const socketId = userIdToSocket.get(userId);
      if (client) {
        io.to(socketId).emit(SOCKET.WATSAPP_CONNECTED, {
          message: "connected to whatsApp successfully",
          status: "connected",
        });
      } else {
        io.to(socketId).emit(SOCKET.WATSAPP_DISCONNECTED, {
          disconnected: true,
          message: "whatsapp not connected",
        });
      }
    } else {
      io.to(socketId).emit(SOCKET.WATSAPP_DISCONNECTED, {
        disconnected: true,
        message: "whatsapp not connected",
      });
    }

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      const disconnectedUserId = socketToUserId.get(socket.id);
      if (disconnectedUserId) {
        socketToUserId.delete(socket.id);
        // userIdToSocket.delete(disconnectedUserId);
        delete userIdToSocket[disconnectedUserId];
        console.log(`Removed mapping for userId ${disconnectedUserId}`);
      }
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

const emitToUser = (event, msg, userId) => {
  if (io) {
    const socketId = userIdToSocket[userId];
    if (socketId) {
      io.to(socketId).emit(event, msg); // Emit to specific socket
      console.log(`Emitted ${event} to userId ${userId} (socket ${socketId})`);
    } else {
      console.warn(`No socket found for userId ${userId}`);
    }
  }
};

const emitIOMessage = (msg, userId) => {
  if (io) {
    const socketId = userIdToSocket[userId];
    io.to(socketId).emit("message", msg);
  }
};
const emitIOMessageStats = (msg, userId) => {
  if (io) {
    const socketId = userIdToSocket[userId];
    io.to(socketId).emit("listen_message", msg);
  }
};
const emitIOCreditLimitStats = (msg, userId) => {
  if (io) {
    const socketId = userIdToSocket[userId];
    io.to(socketId).emit("update_credit", msg);
  }
};
// @initialize it when start from client side
module.exports = {
  initSocket,
  getIO,
  emitIOMessage,
  emitIOMessageStats,
  emitIOCreditLimitStats,
  userIdToSocket,
  emitToUser,
};
