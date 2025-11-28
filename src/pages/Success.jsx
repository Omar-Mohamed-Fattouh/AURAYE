// src/pages/Success.jsx
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
};

export default Success;
