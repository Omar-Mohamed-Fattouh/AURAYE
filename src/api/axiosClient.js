import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Token Interceptor
axiosClient.interceptors.request.use((config) => {
  let token = null;

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      token = user?.token || user?.jwtToken || user?.accessToken || null;
    } catch {}
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
