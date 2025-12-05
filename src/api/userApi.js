// src/api/userApi.js
import axiosClient from "./axiosClient";

// Users API
const userApi = {
  // Get user profile
  getProfile: () => {
    return axiosClient.get("/Users/profile");
  },

  // Update user profile
  updateProfile: (data) => {
    // data = { fullName, phoneNumber, email }
    return axiosClient.put("/Users/profile", data);
  },

  // Upload user image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/Users/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Change user password
  changePassword: (data) => {
    // data = { oldPassword, newPassword, confirmPassword }
    return axiosClient.put("/Users/change-password", data);
  },
};

export default userApi;
