import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://graduation-project1.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  let token = null;

  // 1) جرّبي تقري user من localStorage أو sessionStorage
  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      token = user?.token || user?.jwtToken || user?.accessToken || null;
    } catch {
      // لو ال JSON بايظ نطنشه
    }
  }

  // 2) لو مفيش توكن جوا user → استخدم "token" العادي
  if (!token) {
    token = localStorage.getItem("token");
  }

  // 3) لو لقينا توكن فعلاً → ابعتيه في الـ header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
