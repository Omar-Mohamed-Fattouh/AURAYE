// src/components/CartSummary.jsx
import { Truck, ShieldCheck, Tag } from "lucide-react";
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
      <div className=" bg-white p-6 sticky top-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-800">
              Order summary
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        </div>

          {/* Promo */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Tag className="w-3.5 h-3.5" />
              <span>Have a promo code?</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={localCode}
                onChange={(e) => {
                  setLocalCode(e.target.value);
                  setPromoCode(e.target.value);
                }}
                placeholder="Enter promo"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={!localCode || loading}
                className="px-4 py-2 text-xs font-semibold bg-black text-white rounded-lg hover:bg-gray-900 transition uppercase tracking-wide disabled:opacity-60"
              >
                Apply
              </button>
            </div>
          </div>

        {/* Lines */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-800">
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
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs uppercase text-gray-500 tracking-[0.16em]">
            Estimated total
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatEGP(total)}
          </div>
        </div>

        {/* Free shipping bar */}
        <div className="mt-1">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <Truck className="w-4 h-4 text-gray-700" />
            {amountToFreeShipping > 0 ? (
              <p>
                You’re{" "}
                <span className="font-semibold text-amber-600">
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
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-3">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={itemsCount === 0 || loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold tracking-wide uppercase py-3 rounded-full hover:bg-gray-900 transition disabled:opacity-60"
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
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-[12px] text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure checkout · Encrypted payment</span>
        </div>
      </div>
    </aside>
  );
}
