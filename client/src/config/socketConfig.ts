import { io, Socket } from "socket.io-client";
import { API } from "../utils/common";

// Create a Socket.IO connection
const socket: Socket = io(API, {
  autoConnect: false, // Disable auto-connect (optional)
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in ms
});

export default socket;
