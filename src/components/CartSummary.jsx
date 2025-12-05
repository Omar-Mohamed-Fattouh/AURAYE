import { Truck, Tag, ShieldCheck } from "lucide-react";
import { formatEGP } from "../components/formatCurrency";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function CartSummary({
  itemsCount,
  subtotal,
  shipping,
  discount,
  tax,
  total,
  amountToFreeShipping,
  promoCode,
  setPromoCode,
  onApplyPromo,
  onClearCart,
  loading = false,
}) {
  const navigate = useNavigate();
  const [localCode, setLocalCode] = useState(promoCode || "");
  const FREE_SHIPPING = 1500;

  const progressPercent = useMemo(() => {
    const base = Math.max(subtotal - discount, 0);
    return Math.min(100, Math.round((base / FREE_SHIPPING) * 100));
  }, [subtotal, discount]);

  const handleApply = () => {
    onApplyPromo(localCode);
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { subtotal, shipping, discount, tax, total },
    });
  };

  return (
    <aside className="w-full md:w-[360px] lg:w-[380px]">
      <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-lg sticky top-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-700">
              Order summary
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        </div>

        {/* Lines */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Items ({itemsCount})</span>
            <span>{formatEGP(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatEGP(shipping)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Discount</span>
            <span className="text-red-600">- {formatEGP(discount)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>{formatEGP(tax)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs uppercase text-gray-500 tracking-[0.16em]">
            Estimated total
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatEGP(total)}
          </div>
        </div>

        {/* Free shipping bar */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <Truck className="w-4 h-4 text-gray-700" />
            {amountToFreeShipping > 0 ? (
              <p>
                You’re{" "}
                <span className="font-semibold text-red-500">
                  {formatEGP(amountToFreeShipping)}
                </span>{" "}
                away from free shipping.
              </p>
            ) : (
              <p className="text-emerald-600">
                You’ve unlocked{" "}
                <span className="font-semibold">free shipping</span>!
              </p>
            )}
          </div>

          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-5">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={itemsCount === 0 || loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-yellow-300 text-black text-sm font-semibold tracking-wide uppercase py-3 rounded-full hover:bg-yellow-400 transition shadow-sm disabled:opacity-60"
          >
            Checkout
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/products")}
            className="w-full inline-flex items-center justify-center text-xs font-semibold uppercase tracking-wide py-3 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
          >
            Continue shopping
          </button>

        </div>

        {/* Secure text */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100 text-[12px] text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure checkout · Encrypted payment</span>
        </div>
      </div>
    </aside>
  );
}
