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
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
];

export default function ResetPassword() {
  const { token } = useParams(); // استخدمنا token بدل id
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

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-gray-200">
          {/* ---------- Title + Intro Text ---------- */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Reset Your Password
            </h1>

            <p className="text-gray-500 mt-3 text-sm leading-relaxed max-w-sm mx-auto">
              Create a strong and secure password to protect your account. Make
              sure your new password is unique.
            </p>
          </div>

          {/* ---------- FORM ---------- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* PASSWORD */}
            <div>
              <label className="text-gray-700 font-medium text-sm">
                New Password
              </label>

              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your new password"
                  className="w-full border border-gray-300 rounded-xl p-3 pl-11 pr-11 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Strength Bar */}
              {passwordValue.length > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        strengthColor[strength - 1]
                      } transition-all`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {strengthText[strength - 1]}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-gray-700 font-medium text-sm">
                Confirm Password
              </label>

              <div className="relative mt-1">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-300 rounded-xl p-3 pl-11 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md transition hover:bg-green-700 ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
