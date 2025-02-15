import axios from "axios";
import { API } from "../utils/common";
import showToast from "../helpers/Toast";

// Create an Axios instance with custom configuration
const axiosInstance = axios.create({
  baseURL: API, // Replace with your API base URL
  withCredentials: true, // Include credentials (cookies) in requests
  headers: {
    "Content-Type": "application/json", // Set default content type
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., add authorization headers)
    const token = JSON.parse(window.localStorage.getItem("access_token")); // Example: Get token from localStorage
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    showToast("error", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response here
    return response;
  },
  (error) => {
    // Handle response errors (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    // if (error.response?.status === 200) {
    //   showToast(error.response?.data?.message || error.message, "success");
    // }
    showToast(error.response?.data?.message || error.message, "error");
    return Promise.reject(error);
  }
);

export default axiosInstance;
