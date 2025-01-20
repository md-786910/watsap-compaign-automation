const { Server } = require("socket.io");

class SocketManager {
  static instance = null;
  io = null;

  constructor(socketServer) {
    this.io = new Server(socketServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    if (this.io) {
      this.io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        socket.on("disconnect", () => {
          console.log("user disconnected");
        });
      });
    }
  }

  //   static getInstance(server) {
  //     if (!SocketManager.instance) {
  //       SocketManager.instance = new SocketManager();
  //     }
  //     return SocketManager.instance;
  //   }
  getIo() {
    return this.io;
  }
}

module.exports = SocketManager;
