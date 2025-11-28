import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getCart, removeCartItem } from "../api/productsApi";
import { toast } from "sonner";

import CartItem from "../components/CartItem.jsx";
import CartSummary from "../components/CartSummary.jsx";

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCart({
          items: response.items.map((item) => ({
            id: item.cartItemId,
            name: item.title,
            quantity: item.quantity,
            price: item.unitPrice,
            image_url: item.imageUrl,
            color: item.color,
            size: item.size,
          })),
          total: response.total,
        });
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = (id, value) => {
    if (value <= 0) return;
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      ),
      total: prev.items.reduce((sum, item) => {
        if (item.id === id) return sum + item.price * value;
        return sum + item.price * item.quantity;
      }, 0),
    }));
  };

  const handleRemove = async (id) => {
    try {
      await removeCartItem(id);

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        total: prev.items
          .filter((item) => item.id !== id)
          .reduce((sum, item) => sum + item.price * item.quantity, 0),
      }));

      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const { items, total } = cart;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="border rounded-2xl p-14 text-center bg-white shadow-sm">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-500 mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-5">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    handleQuantityChange={handleQuantityChange}
                    handleRemove={handleRemove}
                  />
                ))}
              </div>

              <CartSummary items={items} total={total} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
