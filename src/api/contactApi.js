// contactApi.js
import axiosClient from "./axiosClient";

// Send a contact message
export const sendContactMessage = async ({ name, email, subject, message }) => {
  try {
    const response = await axiosClient.post("/Contact", {
      name,
      email,
      subject,
      message,
    });
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to send message");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};

// ✅ Subscribe to newsletter
export const subscribeNewsletter = async (email) => {
  try {
    const response = await axiosClient.post(
      "/Newsletter/subscribe",
      { email }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to subscribe to newsletter"
      );
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};
