// src/components/CheckoutContainer.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCart } from "../api/productsApi";
import { createOrder, createPaymentIntent } from "../api/payApi";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutContainer() {
  const navigate = useNavigate();
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();

        if (!data.items || data.items.length === 0) {
          toast.error("Your cart is empty. Please add items before checkout.");
          navigate("/cart");
          return;
        }

        setCartItems(data.items);
        setCartTotal(data.total ?? 0);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch cart data.");
        navigate("/cart");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // احتساب subtotal من الـ items لو حابب تستخدمه في الـ UI
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + Number(item.unitPrice ?? item.price ?? 0) * Number(item.quantity ?? 1),
        0
      ),
    [cartItems]
  );

  const handleCheckout = async (formData) => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const mappedPaymentMethod =
        formData.paymentMethod === "cod" ? "Cash" : "CreditCard";

      const orderData = {
        paymentMethod: mappedPaymentMethod,
        recipientName: formData.fullName.trim(),
        phoneNumber: formData.phone.trim(),
        email: formData.email.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
        })),
        totalAmount: cartTotal || subtotal,
      };

      const orderResponse = await createOrder(orderData);

      if (mappedPaymentMethod === "Cash") {
        toast.success("Order placed successfully!");
        navigate("/success");
      } else {
        const paymentIntent = await createPaymentIntent({
          amount: orderResponse.totalAmount,
          orderId: orderResponse.orderId,
        });

        navigate("/stripe", {
          state: {
            clientSecret: paymentIntent.clientSecret,
            formData,
            total: orderResponse.totalAmount,
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-md border border-slate-100 p-8 animate-pulse space-y-6">
          <div className="h-7 w-40 bg-slate-200 rounded" />
          <div className="grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
            <div className="space-y-4">
              <div className="h-11 bg-slate-100 rounded-xl" />
              <div className="h-11 bg-slate-100 rounded-xl" />
              <div className="h-11 bg-slate-100 rounded-xl" />
              <div className="h-11 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-64 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <CheckoutForm
      onSubmit={handleCheckout}
      isProcessing={isProcessing}
      cartItems={cartItems}
      subtotal={subtotal}
      total={cartTotal || subtotal}
    />
  );
}
