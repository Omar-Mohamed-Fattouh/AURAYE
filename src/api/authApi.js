import axiosClient from "./axiosClient";

/* ------------------------ REGISTER ------------------------ */
// data = { fullname, email, password }
export const registerUser = async (data) => {
  return axiosClient.post("/auth/register", data);
};

/* ------------------------- LOGIN -------------------------- */
// credentials = { email, password }
export const loginUser = async ({ email, password }) => {
  return axiosClient.post("/auth/login", { email, password });
};

/* --------------------- FORGOT PASSWORD -------------------- */
// backend returns a message OR user object
export const forgotPassword = async (email) => {
  const res = await axiosClient.post("/auth/forgot-password", { email });
  return res.data;
};

/* ---------------------- RESET PASSWORD -------------------- */
// data = { token, newPassword, confirmNewPassword }
export const resetPassword = async ({ token, newPassword, confirmNewPassword }) => {
  return axiosClient.post("/auth/reset-password", {
    token,
    newPassword,
    confirmNewPassword,
  });
};

/* ---------------------- GET CURRENT USER ------------------ */
// Requires: Authorization Header (token already handled by axiosClient)
export const getCurrentUser = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};
