// src/components/PaymentMethodSelector.jsx
import { Wallet, CreditCard as CardIcon, Truck } from "lucide-react";

export default function PaymentMethodSelector({ selected, register, error }) {
  const base =
    "flex-1 rounded-2xl border px-4 py-3 md:px-5 md:py-4 cursor-pointer flex items-start gap-3 transition bg-white";

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-semibold text-slate-900">
          Payment method
        </label>
        <p className="text-xs text-slate-500 mt-0.5">
          Choose how you’d like to pay for your order.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {/* Cash on delivery */}
        <label
          className={`${base} ${
            selected === "cod"
              ? "border-emerald-500 ring-2 ring-emerald-500/20"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <input
            type="radio"
            {...register}
            value="cod"
            className="mt-1 accent-emerald-600"
          />
          <div className="flex-1 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Cash on delivery
              </p>
              <p className="text-xs text-slate-500">
                Pay in cash when your order arrives at your doorstep.
              </p>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Truck className="w-3 h-3" />
                <span>Available for most locations</span>
              </div>
            </div>
          </div>
        </label>

        {/* Credit card */}
        <label
          className={`${base} ${
            selected === "CreditCard"
              ? "border-emerald-500 ring-2 ring-emerald-500/20"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <input
            type="radio"
            {...register}
            value="CreditCard"
            className="mt-1 accent-emerald-600"
          />
          <div className="flex-1 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
              <CardIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Credit / Debit card
              </p>
              <p className="text-xs text-slate-500">
                Pay securely with your Visa, Mastercard or other supported
                cards.
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Processed via encrypted Stripe payment gateway.
              </p>
            </div>
          </div>
        </label>
      </div>

      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error.message}</p>
      )}
    </div>
  );
}
