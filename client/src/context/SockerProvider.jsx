import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_API } from '../utils/common';

// Create Socket Context
const SocketContext = createContext(null);

// Socket Provider Component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = JSON.parse(JSON.parse(localStorage.getItem("user")));
  const session_id = JSON.parse(localStorage.getItem("session_id"));
  useEffect(() => {
    // Initialize Socket.IO client
    const socketInstance = io(SOCKET_API, {
      reconnection: true, // Automatically reconnect if disconnected
      reconnectionAttempts: 5,
      query: { userId: user ? user?._id : null, session_id: session_id || "" },
    });

    // Set socket instance once connected
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setSocket(socketInstance);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      console.log('Socket disconnected');
      setSocket(null);
    };
  }, [session_id]); // Reconnect if token changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};