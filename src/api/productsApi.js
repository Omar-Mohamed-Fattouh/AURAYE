import { size } from "zod";
import axiosClient from "./axiosClient";

/* -------------------------- ADD TO CART -------------------------- */
// data = { productId, color, quantity }
export const addToCart = (data) => axiosClient.post("/Cart/add", data);

/* -------------------------- ADD TO WISHLIST -------------------------- */

export const addToWishlist = (data) => axiosClient.post("/Wishlist/add", data);

/* -------------------------- GET CART -------------------------- */
export const getCart = async () => {
  const response = await axiosClient.get("/Cart");
  return response.data;
};

/* -------------------------- GET PRODUCTS -------------------------- */
export const getProducts = async () => {
  const response = await axiosClient.get("/Products");
  const BASE_URL = "http://graduation-project1.runasp.net";

  return response.data.map((product) => {
    const images =
      product.productImages && product.productImages.length > 0
        ? product.productImages.map((img) => ({
            url: BASE_URL + img.imgUrl,
            color: img.color || "Default",
          }))
        : [{ url: product.defaultImgUrl, color: "Default" }];

    return {
      id: product.productId,
      name: product.title,
      description: product.description,
      price: product.price,
      sizes: product.sizes || [],
      stockQuantity: product.stockQuantity,
      images,
      oldPrice: product.oldPrice || '100',
      category: product.category?.name || "Other",
      gender: product.gender || "Unisex",
      shape: product.shape || "Standard",
      frameMaterial: product.frameMaterial || "Standard",
    };
  });
};
/* -------------------------- REMOVE ITEM FROM CART -------------------------- */
export const removeCartItem = async (itemId) => {
  const response = await axiosClient.delete(`/Cart/remove/${itemId}`);
  return response.data;
};
