import { useEffect, useState } from "react";
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
        setCartTotal(data.total);
      } catch (error) {
        toast.error("Failed to fetch cart data.");
        navigate("/cart");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [navigate]);

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
        totalAmount: cartTotal,
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
            total: cartTotal,
          },
        });
      }
    } catch (error) {
      toast.error("Failed to process order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading cart data...</p>
      </div>
    );
  }

  return (
    <CheckoutForm
      onSubmit={handleCheckout}
      isProcessing={isProcessing}
    />
  );
}
