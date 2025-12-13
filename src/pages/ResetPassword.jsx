import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { Lock, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../api/authApi";
import { createResetSchema } from "../forms/resetSchema";

/* -------- Password Strength Logic -------- */
function calculatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthText = ["Weak", "Medium", "Strong", "Very Strong"];
const strengthColor = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-emerald-500",
];

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createResetSchema()),
  });

  const passwordValue = watch("password", "");
  const strength = calculatePasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPassword({
        token,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
      });
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      const msg =
        err?.response?.data?.message || "Server error. Please try again.";
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
          {/* Title + Intro */}
          <div className="text-center mb-7">
            <p className="text-xs tracking-[0.22em] uppercase text-indigo-400 mb-2">
              Secure update
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
              Reset your password
            </h1>
            <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">
              Choose a strong password to protect your AURAYE account. Avoid
              using the same password on other websites.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* PASSWORD */}
            <div>
              <label className="text-slate-300 text-xs font-medium uppercase tracking-[0.16em]">
                New password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••••"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-50 placeholder-slate-500 p-3 pl-11 pr-11 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {/* Strength Bar */}
              {passwordValue.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        strength > 0 ? strengthColor[strength - 1] : ""
                      } transition-all`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 font-medium">
                    {strength > 0 && strengthText[strength - 1]}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-slate-300 text-xs font-medium uppercase tracking-[0.16em]">
                Confirm password
              </label>

              <div className="relative mt-1.5">
                <Lock
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Repeat your password"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-50 placeholder-slate-500 p-3 pl-11 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Updating..." : "Change password"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
