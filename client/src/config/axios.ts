import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { API } from "../utils/common";

// Create an Axios instance with custom configuration
const axiosInstance: AxiosInstance = axios.create({
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
    const token = localStorage.getItem("authToken"); // Example: Get token from localStorage
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can modify the response here
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Unauthorized access. Redirecting to login...");
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
