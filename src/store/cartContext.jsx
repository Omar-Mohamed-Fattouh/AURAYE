import { useEffect, useState, createContext, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const calculateTotal = (cartItems) =>
    cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
      0
    );

  const addToCart = (product) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === product.id);

      if (existing) {
        return prevItems.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prevItems, product];
    });
  };

  const removeFromCart = (id) =>
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

  const updateQuantity = (id, quantity) =>
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

  const clearCart = () => setItems([]);

  const total = calculateTotal(items);

  return (
    <CartContext.Provider
      value={{ items, total, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
