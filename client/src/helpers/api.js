import axiosInstance from "../config/axios";
import showToast from "./Toast";

const initiateNewWatsappConnection = async ({
  session_id,
  setIsLoading,
  setConnectMessage,
}) => {
  try {
    setIsLoading(true);
    const resp = await axiosInstance.post("/connect-watsapp", {
      session_id,
    });
    if (resp.status == 200) {
      setConnectMessage(resp.data.message);
    }
  } catch (error) {
    showToast(error, "error");
    setIsLoading(false);
  } finally {
    setIsLoading(false);
  }
};
export { initiateNewWatsappConnection };

/*
 Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
*/
