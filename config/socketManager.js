// socket.js
const { Server } = require("socket.io");
const client = require("./watsappConfig");
const { SOCKET } = require("../constant/socket");
let io;
const initSocket = async (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    try {
      console.log("Client connected:", socket.id);
      // @ connect watsapp
      socket.on(SOCKET.WATSAPP_CONNECTED, async (start) => {
        console.log("conncted");
        await client.initialize();
        if (await client.isReady) {
          io.emit(SOCKET.WATSAPP_CONNECTED_REPLY, {
            message: "WhatsApp connected successfully",
            status: true,
          });
        }
      });

      // // @disconnect watsapp
      socket.on(SOCKET.WATSAPP_DISCONNECTED, async (start) => {
        if (await client.isReady) {
          await client.logout();
          await client.destroy();
          io.emit(SOCKET.WATSAPP_DISCONNECTED_REPLY, {
            message: "WhatsApp disconnected successfully",
            status: true,
          });
        } else {
          io.emit(SOCKET.WAIT_FOR_SHUTDOWN, {
            message: "Please wait for second to WhatsApp disconnect",
            status: false,
          });
        }
      });
    } catch (error) {
      socket.emit("error", error?.message);
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
  // const io = getIO();
  if (io) {
    io.emit(SOCKET.MESSAGE, msg);
  }
};
// @initialize it when start from client side
const emitStartClientWatsapWeb = async (started = false) => {
  try {
    if (started) {
      if (client.isReady) {
        await client.logout();
        await client.destroy();
        io.emit(
          SOCKET.WATSAPP_DISCONNECTED,
          "WhatsApp disconnected successfully"
        );
        return true;
      } else {
        io.emit(
          SOCKET.WAIT_FOR_SHUTDOWN,
          "Please wait for WhatsApp to disconnect"
        );
        return true;
      }
    } else {
      await client.initialize();
      if (client.isReady) {
        io.emit(SOCKET.WATSAPP_CONNECTED, "WhatsApp connected successfully");
        return true;
      }
    }
  } catch (error) {
    console.error("Disconnect error:", error);
    throw error;
  }
};

module.exports = { initSocket, getIO, emitIOMessage, emitStartClientWatsapWeb };
