import axiosClient from "./axiosClient";

export const getOrders = async () => {
  const response = await axiosClient.get("/Orders");
  return response.data;
};

// ✅ GET single order by id
export const getOrderById = async (id) => {
  try {
    // الخيار الشائع:
    const res = await axiosClient.get(`/Orders/${id}`);
    return res.data;

    // لو الباك بيرجعها كده بدل اللي فوق:
    // const res = await axiosClient.get(`/Orders/order/${id}`);
    // return res.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
