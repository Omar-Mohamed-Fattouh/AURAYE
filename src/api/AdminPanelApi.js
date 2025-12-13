// src/admin/api/AdminPanelApi.js
import axiosClient from "./axiosClient";

const AdminPanelApi = {
  // ==================== DASHBOARD ====================
  getDashboardStats: async () => {
    const [orders, products, messages, newsletter] = await Promise.all([
      axiosClient.get("/Orders").catch(() => ({ data: [] })),
      axiosClient.get("/Products").catch(() => ({ data: [] })),
      axiosClient.get("/Contact").catch(() => ({ data: [] })),
      // Add newsletter endpoint if exists
    ]);
    return {
      orders: orders.data,
      products: products.data,
      messages: messages.data,
    };
  },

  // ==================== PRODUCTS ====================
  getAllProducts: () => axiosClient.get("/Products"),
  getProductById: (id) => axiosClient.get(`/Products/${id}`),
  getArProducts: () => axiosClient.get("/Products/ar"),
  createProduct: (data) => axiosClient.post("/Products", data),
  updateProduct: (id, data) => axiosClient.put(`/Products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/Products/${id}`),
  
  // Product Images
  uploadProductImages: (productId, formData) =>
    axiosClient.post(`/Products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProductImage: (imageId) =>
    axiosClient.delete(`/Products/images/${imageId}`),
  
  // Product 3D Models
  upload3dModel: (productId, formData) =>
    axiosClient.post(`/Products/${productId}/3dmodel`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete3dModel: (modelId) =>
    axiosClient.delete(`/Products/3dmodels/${modelId}`),

  // ==================== ORDERS ====================
  getAllOrders: () => axiosClient.get("/Orders"),
  getOrderById: (id) => axiosClient.get(`/Orders/${id}`),
  updateOrderStatus: (orderId, status) =>
    axiosClient.put(`/Orders/${orderId}/status`, JSON.stringify(status), {
      headers: { "Content-Type": "application/json" },
    }),
  deleteOrder: (id) => axiosClient.delete(`/Orders/${id}`),

  // ==================== MESSAGES (CONTACT) ====================
  getAllMessages: () => axiosClient.get("/Contact"),
  replyToMessage: (data) => axiosClient.post("/Contact/reply", data),
  deleteMessage: (id) => axiosClient.delete(`/Contact/${id}`),

  // ==================== NEWSLETTER ====================
  sendCampaign: (data) => axiosClient.post("/Newsletter/send-campaign", data),
  getSubscribers: () => axiosClient.get("/Newsletter/subscribers"),

  // ==================== USERS (PROFILE) ====================
  getProfile: () => axiosClient.get("/Users/profile"),
  updateProfile: (data) => axiosClient.put("/Users/profile", data),
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/Users/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteProfileImage: () => axiosClient.put("/Users/remove-image"),

  // ==================== CART (For Testing) ====================
  getCart: () => axiosClient.get("/Cart"),
  clearCart: () => axiosClient.delete("/Cart/clear"),

  // ==================== WISHLIST ====================
  getWishlist: () => axiosClient.get("/Wishlist"),
};

export default AdminPanelApi;