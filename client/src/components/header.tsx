import React, { useEffect, useState } from "react";
import { Menu, MessageCircle, LogIn, LogOut } from "lucide-react";
import socket from "../config/socketConfig";
import axiosInstance from "../config/axios";
import showToast from "../helpers/Toast";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectMessage, setConnectMessage] = useState<string>("...");
  const [isConnected, setIsconnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const connectToWatsapp = async () => {
    try {
      setIsLoading(true);
      const resp = await axiosInstance.post("/connect-watsapp", {
        session_id: "12ew2u389",
        // Math.random().toString(36).substring(2, 15) +
        // Math.random().toString(36).substring(2, 15),
      });
      if (resp.status == 200) {
        setConnectMessage(resp.data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("An unknown error occurred", "error");
      }
      setIsLoggedIn(false);
    } finally {
      setIsLoggedIn(false);
    }
  };
  const disconnectToWatsapp = async () => {
    socket.emit("watsapp_disconnected", false);
    const resp = await axiosInstance.delete("/connect-watsapp");
    if (resp.status == 200) {
      setConnectMessage(resp.data.message);
      showToast(resp.data.message, "success");
      setIsconnected(false);
    }
  };

  useEffect(() => {
    socket.connect();
    // @listen for the 'watsapp_connected' event
    socket.on("watsapp_connected", (data) => {
      setIsconnected(true);
      setConnectMessage(data.message);
    });

    //@refresh seesion
    socket.on("refresh_session", (data) => {
      console.log(data);
      localStorage.clear();
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
          </div>
        </div>
        <div className="text-center p-[0.5px] rounded-md">
          <h4 className="flex items-center text-green-900 font-normal text-xl">
            {connectMessage}
          </h4>
        </div>
        <div className="flex gap-4">
          {!isConnected && (
            <button
              onClick={() => connectToWatsapp()}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-500 text-red-100 hover:bg-blue-400 transition-colors"
              disabled={isLoading}
            >
              <span>{isLoading ? "connecting..." : "Connect to watsapp"}</span>
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
