// src/store/cartContext.jsx
import { createContext, useState, useEffect } from "react";
import { getCartTotalItems, getWishlist } from "../api/productsApi";

export const CartContext = createContext({
  cartCount: 0,
  wishlistCount: 0,
  refreshCounts: () => {},
});

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      const [cartTotal, wishlistRes] = await Promise.all([
        getCartTotalItems().catch(() => null),
        getWishlist().catch(() => null),
      ]);

      // cart
      if (cartTotal !== null) {
        const total =
          typeof cartTotal === "number"
            ? cartTotal
            : typeof cartTotal?.totalItems === "number"
            ? cartTotal.totalItems
            : 0;
        setCartCount(total);
      } else {
        setCartCount(0);
      }

      // wishlist
      if (wishlistRes !== null) {
        const data = wishlistRes.data ?? wishlistRes;
        const itemsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : [];
        setWishlistCount(itemsArray.length);
      } else {
        setWishlistCount(0);
      }
    } catch (err) {
      console.error("Error refreshing counts:", err);
    }
  };

  useEffect(() => {
    // أول لود
    refreshCounts();
  }, []);

  const value = {
    cartCount,
    wishlistCount,
    refreshCounts,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
