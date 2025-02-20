import React, { useEffect, useState } from "react";
import {
  Menu,
  MessageCircle,
  LogOut,
  Podcast,
  User,
  ChevronDown,
  SettingsIcon,
  CreditCard,
} from "lucide-react";
import socket from "../config/socketConfig";
import Button from "../utils/button";
import { useWhatsApp } from "../context/WatsappContext";
import { Link } from "react-router-dom";
import { tabKey } from "../utils/tablist";
import useLocalStorage from "../hooks/useLocalStorage";
import { useFetch } from "../hooks/useFetch";
import showToast from "../helpers/Toast";
import axiosInstance from "../config/axios";
import WatsappMain from "./WatsappMain";
export const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [messageStats, setMessageStats] = useState("");
  const userLogin = useLocalStorage("user")
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

  const [qr, setQr] = useState("");
  const [show, setShow] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [credit, setCredit] = useState()
  const { data, error } = useFetch("/auth/profile", {
    method: "GET",
  }, [])

  if (error) {
    return showToast(error, "error")
  }


  const logout = async () => {
    try {
      const resp = await axiosInstance.post("/auth/logout");
      if (resp.status === 200) {
        showToast(resp.data.message, "success")
        window.localStorage.clear("access_token");
        window.localStorage.clear("user");

        setTimeout(() => {
          window.location.href = "/";
        }, 400);
      }
    } catch (error) {
      showToast(error, "error")
    }
  }

  useEffect(() => {
    socket.connect();
    // @listen for the 'watsapp_connected' event
    socket.on("watsapp_connected", (data) => {
      if (data) {
        setIsConnected(true);
        setConnectMessage(data.message);
        setIsLoading(false);

        if (data?.qr) {
          setQr(data.qr)
          setTimeout(() => {
            setShow(true)
          }, 200)
        }
        if (data?.connecting == true) {
          setConnectMessage("watsapp connecting... please wait for while do not close window!");
        } else {
          setShow(false)
        }
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

    //@refresh update_credit
    socket.on("update_credit", (data) => {
      setCredit(data);
    });

    socket.on("qr", (data) => {
      setQr(data);
    });

    return () => {
      // socket.off("watsapp_connected");
      // socket.off("watsapp_disconnected");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (data) {
      setCredit(data?.remaining_credit)
    }
  }, [data])
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      {show && <WatsappMain handleCloseWatsapp={disconnectFromWhatsApp} qr={qr} setShow={setShow} message={connectMessage} />}
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
            <span className="text-sm text-blue-600 font-medium">Credits: {credit}</span>
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
                  onClick={async () => {
                    if (userLogin) {
                      // can do logout
                      await logout();
                    }
                  }}
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
