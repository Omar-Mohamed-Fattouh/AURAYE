// ShippingInfo.jsx
import React, { useEffect, useState } from "react";
import { getOrderById } from "../api/orderApi";

export default function ShippingInfo({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    getOrderById(orderId)
      .then((data) => setOrder(data))
      .catch((error) => console.error(error.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return <p className="text-red-500">No order ID provided.</p>;
  }

  if (loading) {
    return <p className="text-gray-600">Loading shipping info...</p>;
  }

  if (!order) {
    return <p className="text-red-500">Failed to load order data.</p>;
  }

  const {
    orderId: id,
    shippingAddress,
    shippingStatus,
    paymentStatus,
    deliveryDate,
    shippingCost,
    totalAmount,
  } = order;

  return (
    <div className="border p-4 rounded-xl shadow-md bg-white space-y-4">
      <h2 className="text-2xl font-semibold">Shipping Information</h2>

      <div className="space-y-2">
        <p><strong>Order ID:</strong> {id}</p>
        <p><strong>Shipping Address:</strong> {shippingAddress}</p>
        <p className="capitalize"><strong>Shipping Status:</strong> {shippingStatus}</p>
        <p className="capitalize"><strong>Payment Status:</strong> {paymentStatus}</p>
        <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleDateString()}</p>
        <p><strong>Shipping Cost:</strong> {shippingCost} EGP</p>
        <p><strong>Total Amount:</strong> {totalAmount} EGP</p>
      </div>
    </div>
  );
}
