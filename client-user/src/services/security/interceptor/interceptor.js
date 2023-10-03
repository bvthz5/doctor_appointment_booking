import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {},
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error?.response?.status === 401||error?.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.clear();
      window.location.replace("/");
    } else {
      throw error;
    }
  }
);
export const axiosPrivate = instance;
