import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { forgotSchema } from "../forms/forgotSchema";
import { useState } from "react";

export default function ForgetPassword() {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const handleForget = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);

      toast.info("If the email exists, a password reset link has been sent.");
    } catch (err) {
      console.error("Forget password error:", err);
      const msg =
        err?.response?.data?.message || "Server error. Please try again later.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-700">
            Forgot Your Password?
          </h1>
          <p className="text-gray-500 mb-6">
            Enter your email to receive instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit(handleForget)} className="space-y-5">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>{" "}
            or{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
