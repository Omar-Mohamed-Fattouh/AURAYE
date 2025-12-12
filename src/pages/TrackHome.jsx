// src/pages/TrackHome.jsx
import { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../features/auth/AuthContext";
import { getOrderById } from "../api/orderApi";
import { Search, Package, ArrowRight, LogIn, UserPlus } from "lucide-react";
import AurayeLoader from "../components/AurayeLoader";

export default function TrackHome() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const [id, setId] = useState("");
  const [checking, setChecking] = useState(false);

  const cleanId = useMemo(() => String(id).trim(), [id]);
  const isDigitsOnly = useMemo(() => /^\d+$/.test(cleanId), [cleanId]);

  // optional: allow Enter key and prevent spaces-only issues already handled via trim
  useEffect(() => {
    // no-op placeholder if you want future enhancements
  }, []);

  const validate = () => {
    if (!cleanId) {
      toast.error("Please enter an Order ID");
      return false;
    }
    if (!isDigitsOnly) {
      toast.error("Order ID must be numbers only");
      return false;
    }
    return true;
  };

  const go = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setChecking(true);

      // ✅ check existence to avoid navigating to 404
      const res = await getOrderById(cleanId);
      const order = res?.data ?? res;

      if (!order) {
        toast.error("This order does not exist");
        return;
      }

      navigate(`/track/${cleanId}`);
    } catch (err) {
      // ✅ handle 404 without console spam + show user-friendly toast
      const status = err?.response?.status;
      if (status === 404) {
        toast.error("This order does not exist");
      } else {
        toast.error("Failed to verify this order. Please try again.");
      }
    } finally {
      setChecking(false);
    }
  };

  // ✅ Full-page loader while verifying
  if (checking) {
    return <AurayeLoader label="Checking order" subtitle="AURAYE" />;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-black flex justify-center items-center">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-black text-white grid place-items-center border border-black/10">
                  <Package className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Track your order
                </h1>
              </div>
              <p className="text-sm text-black/60 mt-2">
                Enter your Order ID to see payment, shipping, and delivery progress.
              </p>
            </div>

            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black/80 hover:border-black/25 hover:bg-black/[0.03] transition"
            >
              Browse
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Not logged in */}
          {!isLoggedIn && (
            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <p className="font-semibold">You’re not logged in</p>
              <p className="text-sm text-black/60 mt-1">
                Log in to track your orders easily.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-4 py-2.5 text-sm font-semibold hover:bg-black/90 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-black/80 hover:border-black/30 hover:bg-black/[0.03] transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Form card */}
        {isLoggedIn && (
          <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
            <form onSubmit={go} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-black/80">
                  Order ID
                </label>

                <div className="relative">
                  <Search className="w-4 h-4 text-black/35 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onBlur={() => {
                      // lightweight inline validation (no toast spam)
                      if (id && !isDigitsOnly) {
                        toast.error("Order ID must be numbers only");
                      }
                    }}
                    placeholder="e.g. 245"
                    inputMode="numeric"
                    className={[
                      "w-full pl-9 pr-3 py-3 rounded-2xl border bg-white text-sm text-black",
                      "outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30",
                      cleanId && !isDigitsOnly
                        ? "border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10"
                        : "border-black/10",
                    ].join(" ")}
                  />
                </div>

                {/* Inline hint */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-black/50">
                    Numbers only. We’ll check the order before opening the tracking page.
                  </p>
                  {!!cleanId && !isDigitsOnly && (
                    <span className="text-xs font-semibold text-red-600">
                      Invalid ID format
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!cleanId || !isDigitsOnly}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-black text-white py-3 text-sm font-semibold hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package className="w-4 h-4" />
                Track Order
              </button>

              <div className="pt-3 border-t border-black/10">
                <Link
                  to="/shipping"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 hover:text-black transition"
                >
                  View all my orders
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
