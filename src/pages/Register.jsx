import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { registerSchema } from "../forms/registerSchema";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";
import { toast } from "sonner";
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
  "bg-orange-400",
  "bg-yellow-400",
  "bg-emerald-500",
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, setIsLoggedIn } = useContext(AuthContext); // ⬅️ بدل prop

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
    "w-full bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-50 placeholder-slate-500 p-3 pl-11 pr-11 transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
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

      reset();
      navigate("/");
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
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ToastContainer position="top-center" />

      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.8)] overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* ---------------- LEFT HERO ---------------- */}
            <div className="relative hidden md:flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900">
              {/* Top bar */}
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
                  <span>Back to website</span>
                </Link>
              </div>

              {/* Middle content */}
              <div className="mt-10 space-y-4">
                <h1 className="text-3xl lg:text-4xl font-semibold text-white leading-snug">
                  See the world through
                  <br />
                  <span className="font-bold">Augmented Vision.</span>
                </h1>
                <p className="text-sm text-indigo-100/90 max-w-xs">
                  Create your AURAYE account to try frames in AR, save your
                  favourites, and checkout in seconds.
                </p>
              </div>

              {/* Bottom dots / caption */}
              <div className="flex items-center justify-between mt-10">
                <p className="text-xs text-indigo-100/80">
                  Capturing looks, creating moments.
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-5 rounded-full bg-white" />
                  <span className="h-1.5 w-2 rounded-full bg-white/40" />
                  <span className="h-1.5 w-2 rounded-full bg-white/30" />
                </div>
              </div>
            </div>

            {/* ---------------- RIGHT FORM ---------------- */}
            <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10 bg-slate-900">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-50">
                  Create an account
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Log in
                  </Link>
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* FULL NAME */}
                <div>
                  <label className="text-slate-300 text-xs font-medium uppercase tracking-[0.16em]">
                    Full name
                  </label>
                  <div className="relative mt-1.5">
                    <User
                      size={18}
                      className="absolute left-3 top-3 text-slate-500"
                    />
                    <input
                      type="text"
                      {...register("fullName")}
                      className={inputClass}
                      placeholder="Omar Fattouh"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

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
                  <label className="text-slate-300 text-xs font-medium uppercase tracking-[0.16em]">
                    Password
                  </label>
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
                      <p className="text-[11px] mt-1 font-medium text-slate-300">
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
                      size={18}
                      className="absolute left-3 top-3 text-slate-500"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={inputClass}
                      placeholder="Repeat your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword.message}
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
                    Keep me signed in on this device
                  </label>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-2 bg-indigo-500 hover:bg-indigo-400 text-slate-50 py-3 rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-500/30 transition ${
                    loading && "opacity-60 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

                {/* SMALL FOOTER */}
                <p className="text-[11px] text-slate-500 text-center pt-2">
                  By creating an account, you agree to AURAYE’s{" "}
                  <span className="text-slate-300 underline underline-offset-2 cursor-default">
                    Terms &amp; Privacy
                  </span>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
