import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSchema } from "../forms/loginSchema";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Login({ setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "omarmfattouh00@gmail.com",
      password: "Omar01284$$",
      rememberMe: false,
    },
  });

  const inputClass =
    "w-full border border-gray-300 rounded-xl p-3 pl-11 pr-11 transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      const userSafe = {
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        token: response.data.token,
      };

      // Toast message
      toast.success(`Login successful, ${userSafe.fullName}!`);
      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token;

      // خزن الـ user
      if (data.rememberMe) {
        localStorage.setItem("user", JSON.stringify(userSafe));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userSafe));
      }

      // خزن الـ token دايمًا في localStorage
      localStorage.setItem("token", token);

      setUser(userSafe);
      navigate("/");
    } catch (err) {
      console.log("FULL ERROR:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors ||
        "Login failed";

      toast.error(
        typeof backendMessage === "string"
          ? backendMessage
          : JSON.stringify(backendMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <ToastContainer position="top-center" /> */}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Login to Your Account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-gray-600 text-sm">Password</label>
                <Link
                  to="/forget-password"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Lock
                  size={20}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={inputClass}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* REMEMBER ME */}
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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-semibold ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* SIGN UP LINK */}
            <p className="text-sm text-gray-600 mt-4 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
