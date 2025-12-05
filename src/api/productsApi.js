// src/api/productsApi.js
import axiosClient from "./axiosClient";

/* -------------------------- ADD TO CART -------------------------- */
// data = { productId, color, quantity }
export const addToCart = (data) => axiosClient.post("/Cart/add", data);

/* -------------------------- MOVE CART ITEM TO WISHLIST -------------------------- */
export const moveCartItemToWishlist = async (itemId) => {
  const response = await axiosClient.post(
    `/Cart/move-to-wishlist/${itemId}`
  );
  return response.data;
};

/* -------------------------- GET CART -------------------------- */
export const getCart = async () => {
  const response = await axiosClient.get("/Cart");
  return response.data;
};

/* -------------------------- CLEAR CART -------------------------- */
export const clearCart = async () => {
  const response = await axiosClient.delete("/Cart/clear");
  return response.data;
};

/* -------------------------- UPDATE CART ITEM QUANTITY -------------------------- */
export const updateCartItemQuantity = async (itemId, quantity) => {
  const response = await axiosClient.put(`/Cart/update/${itemId}`, {
    quantity,
  });
  return response.data;
};

/* -------------------------- CHANGE CART ITEM COLOR -------------------------- */
export const changeCartItemColor = async (itemId, color) => {
  const response = await axiosClient.put(`/Cart/change-color/${itemId}`, {
    color,
  });
  return response.data;
};

/* -------------------------- GET CART TOTAL ITEMS -------------------------- */
export const getCartTotalItems = async () => {
  const response = await axiosClient.get("/Cart/total-items");
  return response.data;
};

/* -------------------------- REMOVE ITEM FROM CART -------------------------- */
export const removeCartItem = async (itemId) => {
  const response = await axiosClient.delete(`/Cart/remove/${itemId}`);
  return response.data;
};

/* -------------------------- WISHLIST -------------------------- */
export const removeFromWishlist = (productId) =>
  axiosClient.delete(`/Wishlist/remove/${productId}`);

export const addToWishlist = (productId) =>
  axiosClient.post(`/Wishlist/add?productId=${productId}`);

export const isProductInWishlist = (productId) =>
  axiosClient.get(`/Wishlist/isExist?productId=${productId}`);

export const getWishlist = () => axiosClient.get("/Wishlist");

/* -------------------------- PRODUCTS -------------------------- */
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
      oldPrice: product.oldPrice || null,
      category: product.category?.name || "Other",
      gender: product.gender || "Unisex",
      shape: product.shape || "Standard",
      frameMaterial: product.frameMaterial || "Standard",
    };
  });
};

/* -------------------------- BESTSELLER -------------------------- */
export const getBestSellerProducts = async () => {
  const response = await axiosClient.get("/Products/bestseller");
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
      oldPrice: product.oldPrice || null,
      category: product.category?.name || "Other",
      gender: product.gender || "Unisex",
      shape: product.shape || "Standard",
      frameMaterial: product.frameMaterial || "Standard",
    };
  });
};
