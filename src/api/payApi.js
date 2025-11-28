import axiosClient from "./axiosClient";

/* -------------------- CREATE PAYMENT INTENT -------------------- */
export const createPaymentIntent = async ({ amount, orderId }) => {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const token = user?.token || user?.jwtToken || user?.accessToken;
  if (!token) {
    throw new Error("User token not found. Please login again.");
  }
  try {
    const response = await axiosClient.post(
      "/Payments/create-payment-intent",
      { amount, orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("🔥 API ERROR:", error.response?.data || error.message);
    throw error;
  }
};

/* ------------------------ CONFIRM PAYMENT ---------------------- */
export const confirmPayment = async (data) => {
  const res = await axiosClient.post("/payments/confirm", data);
  return res.data;
};

/* ---------------------- GET PAYMENT STATUS -------------------- */
export const getPaymentStatus = async (paymentIntentId) => {
  const res = await axiosClient.get(`/payments/status/${paymentIntentId}`);
  return res.data;
};

////////////////////////////////


export const createOrder = async (orderData) => {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const token = user?.token || user?.jwtToken || user?.accessToken;
  if (!token) {
    throw new Error("User token not found. Please login again.");
  }

  try {
    const response = await axiosClient.post("/Orders", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("🔥 API ERROR (Create Order):", error.response?.data || error.message);
    throw error;
  }
};