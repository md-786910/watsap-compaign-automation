import React, { useEffect, useState } from "react";
import {
  Menu,
  MessageCircle,
  LogIn,
  LogOut,
  Save,
  Podcast,
  User,
  ChevronDown,
  SettingsIcon,
  CreditCard,
} from "lucide-react";
import socket from "../config/socketConfig";
import axiosInstance from "../config/axios";
import showToast from "../helpers/Toast";
import Button from "../utils/button";
import { useWhatsApp } from "../context/WatsappContext";
import { Link } from "react-router-dom";
import { tabKey } from "../utils/tablist";
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
              <Link to="/">
                WhatsApp Compaign
              </Link>
            </span>
          </div>
        </div>
        <div className="text-center p-[0.5px] rounded-md">
          <p
            className="border-2 px-2 py-[0.5px] uppercase rounded-md flex items-center text-blue-900"
            style={{ fontWeight: "450" }}
          >
            {connectMessage}
          </p>
          <span className="text-xs font-bold text-red-500">
            {messageStats}{" "}
          </span>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-50 px-3 py-1 rounded-md flex items-center">
            <span className="text-sm text-blue-600 font-medium">Credits: 2,500</span>
          </div>
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
              className="flex items-center space-x-2 px-4 py-1 rounded-md bg-blue-50 text-red-600 hover:bg-blue-100 transition-colors"
            >
              <span>Disconect from watsapp</span>
            </button>
          )}


          {/* Profile donw */}
          <div className="relative">

            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <Link to={`/dashboard/settings?tab=${tabKey.PROFILE}`} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link >
                <Link to={`/dashboard/settings?tab=${tabKey.GENERAL}`} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </Link >
                <Link to={`/dashboard/settings?tab=${tabKey.SUBSCRIPTION}`} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscription
                </Link >
                <hr className="my-1" />
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button >
              </div>
            )}
          </div>
          {/* End */}

        </div>
      </div>
    </header>
  );
};
