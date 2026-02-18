import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL2
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.token = token; // matches backend
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Session expired. Please login again."
    ) {
      localStorage.removeItem("token");

      // 🔔 Notify React App
      window.dispatchEvent(new Event("session-expired"));
    }

    return Promise.reject(error);
  }
);


export default api;

