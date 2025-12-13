// src/pages/Success.jsx
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-3xl p-8 text-center border border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Payment successful
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Thank you for your purchase. Your order has been received and is now
          being processed. We&apos;ll send you an email with the details shortly.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full text-sm transition"
          >
            Back to shop
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-3 rounded-full text-sm transition"
          >
            View cart
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          If you have any questions about your order, please contact our
          support team.
        </p>
      </div>
    </div>
  );
};

export default Success;
