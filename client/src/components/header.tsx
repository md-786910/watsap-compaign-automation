import React, { useEffect, useState } from "react";
import { Menu, MessageCircle, LogIn, LogOut } from "lucide-react";
import socket from "../config/socketConfig";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectMessage, setConnectMessage] = useState<string>("");
  const [isConnected, setIsconnected] = useState(false);
  const connectToWatsapp = () => {
    console.log("cons");
    socket.emit("watsapp_connected", true);
  };

  const disconnectToWatsapp = () => {
    socket.emit("watsapp_disconnected", false);
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("wait_for_shutdown", (data) => {
      console.log(data);
      setConnectMessage(data.message);
      setIsconnected(data.status);
    });

    socket.on("watsapp_connected_reply", (data) => {
      console.log(data);
      setConnectMessage(data.message);
      setIsconnected(data.status);
    });
    socket.on("watsapp_disconnected_reply", (data) => {
      console.log(data);
      setConnectMessage(data.message);
      setIsconnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-full px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">
              WhatsApp Compaign
            </span>
            <h4 className="text-blue-600">{connectMessage}</h4>
          </div>
        </div>
        <div className="flex gap-4">
          {!isConnected && (
            <button
              onClick={() => connectToWatsapp()}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-50 text-red-600 hover:bg-blue-100 transition-colors"
            >
              <span>Connect to watsapp</span>
            </button>
          )}
          {isConnected && (
            <button
              onClick={() => disconnectToWatsapp()}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-50 text-red-600 hover:bg-blue-100 transition-colors"
            >
              <span>Disconect from watsapp</span>
            </button>
          )}
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
