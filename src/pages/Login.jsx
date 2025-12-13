import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { loginSchema } from "../forms/loginSchema";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setIsLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "omarmfattouh45@gmail.com",
      password: "Omar01284$$$",
      rememberMe: false,
    },
  });

  const inputClass =
    "w-full bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-50 placeholder-slate-500 p-3 pl-11 pr-11 transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none";

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

    toast.success(`Welcome back, ${userSafe.fullName}!`);

    const token = response.data.token;

    if (data.rememberMe) {
      localStorage.setItem("user", JSON.stringify(userSafe));
    } else {
      sessionStorage.setItem("user", JSON.stringify(userSafe));
    }

    localStorage.setItem("token", token);

    if (typeof setUser === "function") {
      setUser(userSafe);
    }
    if (typeof setIsLoggedIn === "function") {
      setIsLoggedIn(true);
    }

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-slate-900/95 border border-white/10 rounded-3xl shadow-[0_24px_80px_rgba(255,255,255,0.1)] overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* LEFT PANEL (copy / testimonial) */}
          <div className="hidden md:flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-black/30 via-emerald-900 to-emerald-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold tracking-widest text-white">
                  AR
                </div>
                <span className="text-white font-semibold tracking-[0.2em] text-xs uppercase">
                  AURAYE
                </span>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-slate-50 px-3 py-1 transition"
              >
                Back to website
              </Link>
            </div>

            <div className="mt-10 space-y-4">
              <p className="text-xs text-emerald-100/80 uppercase tracking-[0.2em]">
                Smart Frames • AR Try-On
              </p>
              <h1 className="text-3xl lg:text-4xl font-semibold text-white leading-snug">
                Log in and pick
                <br />
                <span className="font-bold">your next favourite frame.</span>
              </h1>
              <p className="text-sm text-emerald-50/90 max-w-xs">
                Access your saved try-ons, wishlist, and orders all in one
                place.
              </p>
            </div>

            <div className="mt-10 text-[11px] text-emerald-100/80">
              Trusted by eyewear lovers across Egypt.
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10 bg-black">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
                Welcome back
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Sign in to continue exploring AURAYE.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* EMAIL */}
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
                    {...register("email")}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 text-xs font-medium uppercase tracking-[0.16em]">
                    Password
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-white text-xs hover:text-white/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={inputClass}
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  id="rememberMe"
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-[13px] text-slate-300"
                >
                  Remember me on this device
                </label>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 md:bg-emerald-500 md:hover:bg-emerald-400 bg-white hover:bg-white/80 text-slate-950 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-emerald-500/30 transition ${
                  loading && "opacity-60 cursor-not-allowed"
                }`}
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>

              {/* SIGN UP LINK */}
              <p className="text-sm text-slate-400 mt-4 text-center">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:text-white/80"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
