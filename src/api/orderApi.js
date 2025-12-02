import axiosClient from "./axiosClient";

export const getOrderById = async (id) => {
  const response = await axiosClient.get(`/Orders/${id}`);
  return response.data;
};
