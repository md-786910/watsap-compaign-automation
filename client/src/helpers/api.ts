import axiosInstance from "../config/axios";

exports.connectToWatsappAPI = () => {
  const resp = axiosInstance.post("/connect-watsapp", {
    session_id:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  });
  return resp;
};
