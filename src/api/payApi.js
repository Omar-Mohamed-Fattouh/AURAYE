import axiosClient from "./axiosClient";

/* -------------------- CREATE PAYMENT INTENT -------------------- */
export const createPaymentIntent = async ({ amount, orderId }) => {
  try {
    const response = await axiosClient.post(
      "/Payments/create-payment-intent",
      { amount, orderId }
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

/* ------------------------- CREATE ORDER ----------------------- */
export const createOrder = async (orderData) => {
  try {
    const response = await axiosClient.post("/Orders", orderData);
    return response.data;
  } catch (error) {
    console.error(
      "🔥 API ERROR (Create Order):",
      error.response?.data || error.message
    );
    throw error;
  }
};
