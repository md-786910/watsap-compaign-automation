import React, { useEffect, useState } from "react";
import {
  Menu,
  MessageCircle,
  LogIn,
  LogOut,
  Save,
  Podcast,
} from "lucide-react";
import socket from "../config/socketConfig";
import axiosInstance from "../config/axios";
import showToast from "../helpers/Toast";
import Button from "../utils/button";
import { useWhatsApp } from "../context/WatsappContext";
export const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageStats, setMessageStats] = useState("");
  const {
    setIsConnected,
    setIsLoading,
    setConnectMessage,
    connectMessage,
    isConnected,
    isLoading,
    connectToWhatsApp,
    disconnectFromWhatsApp,
  } = useWhatsApp();

  useEffect(() => {
    socket.connect();
    // @listen for the 'watsapp_connected' event
    socket.on("watsapp_connected", (data) => {
      if (data) {
        setIsConnected(true);
        setConnectMessage(data.message);
        setIsLoading(false);
      }
    });

    socket.on("watsapp_disconnected", ({ disconnected, message }) => {
      if (disconnected) {
        setIsConnected(false);
        setConnectMessage(message);
        setIsLoading(false);
      }
    });

    // @listen message
    socket.on("listen_message", (data) => {
      setMessageStats(data);
    });

    //@refresh seesion
    // socket.on("refresh_session", (data) => {
    //   console.log(data);
    //   localStorage.clear();
    // });

    return () => {
      // socket.off("watsapp_connected");
      // socket.off("watsapp_disconnected");
      socket.disconnect();
    };
  }, [socket]);

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
          <h4
            className="flex items-center text-blue-900 text-xl"
            style={{ fontWeight: "450" }}
          >
            {connectMessage}
          </h4>
          <span className="text-xs font-bold text-red-500">
            {messageStats}{" "}
          </span>
        </div>
        <div className="flex gap-4">
          {!isConnected && (
            <Button
              Icon={Podcast}
              text="Connect to watsapp"
              loadingText="connecting..."
              onClick={() =>
                connectToWhatsApp(
                  Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15)
                )
              }
              isLoading={isLoading}
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            />
          )}
          {isConnected && (
            <button
              onClick={() => disconnectFromWhatsApp()}
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
