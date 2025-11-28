import { useNavigate } from "react-router-dom";

export default function CartSummary({ items, total }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-6 bg-white shadow-md sticky top-24">
      <h2 className="text-xl font-bold mb-5">Order Summary</h2>

      <div className="space-y-3 mb-6 pb-6 border-b">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items ({items.length})</span>
          <span>${Number(total).toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold mb-6">
        <span>Total</span>
        <span className="text-primary">${Number(total).toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout", { state: { items, total } })}
        className="w-full bg-primary text-black hover:bg-primary/90 px-4 py-3 rounded-lg font-semibold transition"
      >
        Proceed to Checkout
      </button>

      <button
        onClick={() => navigate("/")}
        className="w-full mt-3 border border-primary text-primary hover:bg-primary/5 px-4 py-3 rounded-lg font-semibold transition"
      >
        Continue Shopping
      </button>
    </div>
  );
}
