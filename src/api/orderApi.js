import axiosClient from "./axiosClient";
export const getOrders = async () => {
  try {
    const response = await axiosClient.get("/Orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
