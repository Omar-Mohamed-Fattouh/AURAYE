import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../api/authApi";
import { Link } from "react-router-dom";
import { forgotSchema } from "../forms/forgotSchema";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function ForgetPassword() {
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
      toast.info(
        "If the email exists, a password reset link has been sent to your inbox."
      );
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

      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.8)] w-full max-w-lg px-7 py-8 sm:px-9 sm:py-9">
          <div className="mb-6 text-center">
            <p className="text-xs tracking-[0.22em] uppercase text-indigo-400 mb-2">
              Password reset
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
              Forgot your password?
            </h1>
            <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">
              Enter the email address associated with your AURAYE account and
              we&apos;ll send you a link to create a new password.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleForget)}
            className="space-y-5 mt-4"
          >
            <div>
              <label className="text-slate-300 text-xs font-medium uppercase tracking-[0.16em]">
                Email
              </label>
              <div className="relative mt-1.5">
                <Mail
                  size={18}
                  className="absolute left-3 top-3 text-slate-500"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-50 placeholder-slate-500 p-3 pl-11 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-500 hover:bg-indigo-400 text-slate-50 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-500/30 transition ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending link..." : "Send reset link"}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Log in
            </Link>{" "}
            or{" "}
            <Link
              to="/register"
              className="text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
