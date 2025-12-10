// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  let token = null;

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      token = user?.token || user?.jwtToken || user?.accessToken || null;
    } catch {
      // ignore parsing error
    }
  }

  if (!token) {
    token = localStorage.getItem("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
