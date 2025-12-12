// src/api/productsApi.js
import axiosClient from "./axiosClient";

/* -------------------------- ADD TO CART -------------------------- */
// data = { productId, color, quantity }
export const addToCart = (data) => axiosClient.post("/Cart/add", data);

/* -------------------------- MOVE CART ITEM TO WISHLIST -------------------------- */
export const moveCartItemToWishlist = async (itemId) => {
  const response = await axiosClient.post(`/Cart/move-to-wishlist/${itemId}`);
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
  const response = await axiosClient.get("/Cart");    
  const data = response.data;
  const items = Array.isArray(data) ? data : data?.items || data?.cartItems || [];
  return items.length;
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




/* -------------------------- GET PRODUCT REVIEWS -------------------------- */
export const getProductReviews = async (productId) => {
  const response = await axiosClient.get(`/Review/${productId}`);
  return response.data;
};


export const getProductById = async (id) => {
  const response = await axiosClient.get(`/Products/${id}`);
  const product = response.data;

  const BASE_URL = "https://graduationproject11.runasp.net";

  // تجهيز الصور بنفس شكل الـ frontend
  const images =
    product.productImages && product.productImages.length > 0
      ? product.productImages.map((img) => ({
          url: BASE_URL + img.imgUrl,
          color: img.color || "Default",
        }))
      : [
          {
            url: BASE_URL + product.defaultImgUrl,
            color: "Default",
          },
        ];

  return {
    id: product.productId,
    name: product.title,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice || null,
    stockQuantity: product.stockQuantity,
    isAvailable: product.isAvailable,

    images, // الصور بعد التجهيز

    category: product.category?.name || "Other",
    shape: product.shape || "Standard",
    gender: product.gender || "Unisex",
    frameMaterial: product.frameMaterial || "Standard",

    sizes: product.sizes || [],
    models3d: product.product3dModels || [],
    availableColors:product.availableColors || []
  };
};



/* -------------------------- PRODUCTS -------------------------- */
export const getProducts = async () => {
  const response = await axiosClient.get("/Products");
  const BASE_URL = "https://graduationproject11.runasp.net";

  // حل مضمون يمنع الأخطاء
  const productsArray =
    Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.data)
      ? response.data.data
      : [];

  return productsArray.map((product) => {
    const images = [
      {
        url: BASE_URL + product.defaultImgUrl,
        color: "Default",
      },
    ];

    return {
      id: product.productId,
      name: product.title,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || null,

      images,

      category: product.categoryName || "Other",
      shape: product.shape || "Standard",
      gender: product.gender || "Unisex",
      frameMaterial: product.frameMaterial || "Standard",
      sizes: product.sizes || [],
      availableColors: product.availableColors || [],
      stockQuantity: product.stockQuantity || null,
    };
  });
};



/* -------------------------- BESTSELLER -------------------------- */
export const getBestSellerProducts = async () => {
  const response = await axiosClient.get("/Products/bestseller");
  const BASE_URL = "https://graduationproject11.runasp.net";

  // حل يمنع أي Error بسبب map
  const productsArray =
    Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.data)
      ? response.data.data
      : [];

  return productsArray.map((product) => {
    const images = [
      {
        url: BASE_URL + product.defaultImgUrl,
        color: "Default",
      },
    ];

    return {
      id: product.productId,
      name: product.title,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || null,
      images,

      category: product.categoryName || "Other",
      shape: product.shape || "Standard",
      gender: product.gender || "Unisex",
      frameMaterial: product.frameMaterial || "Standard",

      sizes: product.sizes || [],
      availableColors: product.availableColors || [],
      stockQuantity: product.stockQuantity || null,
    };
  });
};

export const getProductsAr = async () => {
  const response = await axiosClient.get("/Products/ar");

  const BASE_URL = "https://graduationproject11.runasp.net";

  const productsArray = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data.data)
    ? response.data.data
    : [];

  return productsArray.map((product) => {
    const images =
      product.productImages && product.productImages.length > 0
        ? product.productImages.map((img) => ({
            url: BASE_URL + img.imgUrl,
            color: img.color || "Default",
          }))
        : [{ url: BASE_URL + product.defaultImgUrl, color: "Default" }];

    const models =
      product.product3dModels && product.product3dModels.length > 0
        ? product.product3dModels
            .map((m) => {
              const rawUrl = m.modelUrl || "";
              const isAbsolute = /^https?:\/\//i.test(rawUrl);
              const fullUrl = (isAbsolute ? rawUrl : BASE_URL + rawUrl).trim();

              const clean = fullUrl.split("?")[0].trim();
              const parts = clean.split(".");
              if (parts.length < 2) return null;
              const ext = parts.pop().trim().toLowerCase();

              // ✅ هنا بنرمي أي mtl أو حاجه مش مدعومة
              if (!["glb", "gltf", "obj"].includes(ext)) return null;

              return {
                url: clean,
                defaultScale: m.defaultScale || 1,
              };
            })
            .filter(Boolean)
        : [];

    return {
      id: product.productId,
      name: product.title,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || null,
      images,
      models,
    };
  });
};
