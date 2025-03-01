import { io } from "socket.io-client";
import { SOCKET_API } from "../utils/common";
const user = JSON.parse(JSON.parse(localStorage.getItem("user")));
const session_id = JSON.parse(localStorage.getItem("session_id"));
const socket = io(SOCKET_API, {
  autoConnect: false, // Disable auto-connect (optional)
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts in ms
  query: { userId: user ? user?._id : null, session_id: session_id || "" },
});

export default socket;
