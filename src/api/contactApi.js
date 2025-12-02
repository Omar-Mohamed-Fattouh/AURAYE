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
    return response.data; // return the API response data
  } catch (error) {
    // Handle errors more gracefully
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.message || "Failed to send message");
    } else if (error.request) {
      // No response received
      throw new Error("No response from server");
    } else {
      // Other errors
      throw new Error(error.message);
    }
  }
};
