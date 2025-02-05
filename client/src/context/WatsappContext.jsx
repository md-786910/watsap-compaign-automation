import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../config/axios";
import showToast from "../helpers/Toast";
import socket from "../config/socketConfig";

const WhatsAppContext = createContext();

export const WhatsAppProvider = ({ children }) => {
    const [connectMessage, setConnectMessage] = useState("...");
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const connectToWhatsApp = async (session_id) => {
        try {
            setIsLoading(true);
            const resp = await axiosInstance.post("/connect-watsapp", {
                session_id,
            });
            if (resp.status === 200) {
                setConnectMessage(resp.data.message);
            }
        } catch (error) {
            showToast(error, "error");
            setIsLoading(false);
            setConnectMessage("error in connection");
        }
    };

    const disconnectFromWhatsApp = async () => {
        try {
            setIsLoading(true);
            // socket.emit("whatsapp_disconnected", false);
            const resp = await axiosInstance.delete("/connect-watsapp");
            if (resp.status === 200) {
                setConnectMessage(resp.data.message);
                setIsConnected(false);
                showToast(resp.data.message, "success");
            }
        } catch (error) {
            showToast(error || "Disconnection failed", "error");
            setIsConnected("")
        } finally {
            setIsLoading(false);
        }
    };

    // start to send message
    const handleStartMessaging = async()=>{
        setIsLoading(true);
        try {
            const resp = await axiosInstance.get("/start-messaging");
            if (resp.status === 200) {
                showToast(resp.data.message, "success");
            }
        } catch (error) {
            showToast(error, "error");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <WhatsAppContext.Provider
            value={{ setConnectMessage, setIsLoading, setIsConnected, connectMessage, isConnected, isLoading, connectToWhatsApp, disconnectFromWhatsApp,handleStartMessaging }}
        >
            {children}
        </WhatsAppContext.Provider>
    );
};

export const useWhatsApp = () => {
    return useContext(WhatsAppContext);
};
