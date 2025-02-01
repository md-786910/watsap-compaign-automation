import { io, Socket } from "socket.io-client";
import { SOCKET_API } from "../utils/common";

const socket: Socket = io(SOCKET_API, {
  autoConnect: false, // Disable auto-connect (optional)
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in ms
});

export default socket;
