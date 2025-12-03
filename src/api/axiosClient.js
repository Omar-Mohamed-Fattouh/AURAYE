import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://graduation-project1.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically to all requests if exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("AUTH HEADER:", config.headers.Authorization);
  return config;
});


export default axiosClient;
