import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";

export default function ShippingInfo() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading shipping info...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border p-4 rounded shadow-sm"
        >
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          <p><strong>Shipping Status:</strong> {order.shippingStatus}</p>
          <p><strong>Shipping Cost:</strong> ${order.shippingCost}</p>
          <p>
            <strong>Delivery Date:</strong>{" "}
            {new Date(order.deliveryDate).toLocaleString()}
          </p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        </div>
      ))}
    </div>
  );
}
