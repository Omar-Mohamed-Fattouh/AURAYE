import axiosClient from "./axiosClient";

/* -------------------------- ADD TO CART -------------------------- */
// data = { productId, color, quantity }
export const addToCart = async (data) => {
  return axiosClient.post("/Cart/add", data);
};

/* -------------------------- GET CART -------------------------- */
export const getCart = async () => {
  const response = await axiosClient.get("/Cart");
  return response.data;
};

/* -------------------------- GET PRODUCTS -------------------------- */
export const getProducts = async () => {
  const response = await axiosClient.get("/Products");
  // خلى البيانات match اللي احنا محتاجينه
  return response.data.map((product) => ({
    id: product.productId,
    name: product.title,
    description: product.description,
    price: product.price,
    stockQuantity: product.stockQuantity,
    image_url: product.defaultImgUrl || product.productImages?.[0]?.imgUrl,
    colors: product.productImages?.map((img) => img.color),
  }));
};

/* -------------------------- REMOVE ITEM FROM CART -------------------------- */
export const removeCartItem = async (itemId) => {
  const response = await axiosClient.delete(`/Cart/remove/${itemId}`);
  return response.data;
};
