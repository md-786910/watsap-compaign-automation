import { toast } from "react-toastify";

class Toast extends Error {
  message: string;
  type: string;

  constructor(message: string, type: string) {
    super(message); // Call the parent Error class constructor
    this.message = message;
    this.type = type;
  }
}

function showToast(message: string, type: string) {
  const toastInstance = new Toast(message, type);
  switch (toastInstance.type) {
    case "success":
      toast.success(toastInstance.message);
      break;
    case "error":
      toast.error(toastInstance.message);
      break;
    case "warning":
      toast.warning(toastInstance.message);
      break;
    default:
      toast(toastInstance.message);
  }
}
export default showToast;
