import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerSchema } from "../forms/registerSchema";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";

/* ----------------------- PASSWORD STRENGTH LOGIC ----------------------- */
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

export default function Register({ setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const passwordValue = watch("password", "");
  const strength = calculatePasswordStrength(passwordValue);

  const inputClass =
    "w-full border border-gray-300 rounded-xl p-3 pl-11 pr-11 transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none";

  /* ----------------------- SUBMIT FUNCTION ----------------------- */
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // إرسال البيانات للـ backend
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await registerUser(payload);

      toast.success("Account created successfully!");

      const userSafe = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        token: response.data.token,
      };

      if (data.rememberMe) {
        localStorage.setItem("user", JSON.stringify(userSafe));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userSafe));
      }

      setUser(userSafe);
      navigate("/");
      reset();
    } catch (err) {
      console.log("FULL ERROR:", err);

      const backendErrors =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        "Error while creating account";

      toast.error(
        typeof backendErrors === "string"
          ? backendErrors
          : JSON.stringify(backendErrors)
      );
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-xl rounded-3xl flex flex-col md:flex-row max-w-4xl w-full">
          {/* ---------------- LEFT BLUE SIDE ---------------- */}
          <div className="w-full md:w-1/2 bg-blue-600 text-white p-10 rounded-l-3xl flex flex-col justify-center">
            <h1 className="text-3xl font-bold leading-snug">
              Simplify management With Our dashboard.
            </h1>
            <p className="opacity-90 mt-3 text-sm">
              Create your account and start managing your system easily.
            </p>
          </div>

          {/* ---------------- RIGHT FORM SIDE ---------------- */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
              Create Your Account
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* ---------------- FULL NAME ---------------- */}
              <div>
                <label className="text-gray-600 text-sm">Full Name</label>
                <div className="relative mt-1">
                  <User
                    size={20}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    {...register("fullName")}
                    className={inputClass}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* ---------------- EMAIL ---------------- */}
              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <div className="relative mt-1">
                  <Mail
                    size={20}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="email"
                    {...register("email")}
                    className={inputClass}
                    placeholder="Enter email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* ---------------- PASSWORD ---------------- */}
              <div>
                <label className="text-gray-600 text-sm">Password</label>
                <div className="relative mt-1">
                  <Lock
                    size={20}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={inputClass}
                    placeholder="Enter a strong password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordValue.length > 0 && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          strengthColor[strength - 1]
                        } transition-all`}
                        style={{ width: `${(strength / 4) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1 font-medium text-gray-600">
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

              {/* ---------------- CONFIRM PASSWORD ---------------- */}
              <div>
                <label className="text-gray-600 text-sm">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Lock
                    size={20}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={inputClass}
                    placeholder="Re-enter password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* ---------------- REMEMBER ME ---------------- */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  id="rememberMe"
                />
                <label htmlFor="rememberMe" className="text-gray-700 text-sm">
                  Remember me
                </label>
              </div>

              {/* ---------------- LINK TO LOGIN ---------------- */}
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login here
                </Link>
              </p>

              {/* ---------------- SUBMIT BUTTON ---------------- */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-semibold ${
                  loading && "opacity-60 cursor-not-allowed"
                }`}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
