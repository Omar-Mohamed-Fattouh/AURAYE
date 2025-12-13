import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StripePaymentForm({
  total,
  onSuccess,
  isProcessing,
  setIsProcessing,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setLocalError("");
    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setLocalError(error.message || "Payment failed. Please try again.");
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful!");
        onSuccess?.();
        setIsProcessing(false);
        navigate("/success"); // navigate to success page in SPA
      } else {
        // Handle other paymentIntent statuses if needed
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setLocalError("Something went wrong while processing your payment.");
      toast.error("Something went wrong while processing your payment.");
      setIsProcessing(false);
    }
  };

  const isDisabled = !stripe || !elements || isProcessing;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
            Secure checkout
          </p>
          <h1 className="mt-1 text-lg md:text-xl font-semibold text-slate-900">
            Complete your payment
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Your card details are encrypted and never stored on our servers.
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase text-slate-400 tracking-wide">
            Amount to pay
          </p>
          <p className="text-xl md:text-2xl font-bold text-slate-900">
            ${Number(total || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment element */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
        <PaymentElement
          options={{
            layout: "tabs",
            business: { name: "Auraye" },
          }}
        />

        {/* Card badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-slate-200 shadow-sm">
            <img src="/visacard.webp" alt="Visa" className="h-4 w-auto" />
            <span>Visa</span>
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-slate-200 shadow-sm">
            <img src="/mastercard.webp" alt="Mastercard" className="h-4 w-auto" />
            <span>Mastercard</span>
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-slate-200 shadow-sm">
            <img src="/stripe.png" alt="Stripe" className="h-4 w-auto" />
            <span>Stripe</span>
          </span>
        </div>
      </div>

      {/* Error message */}
      {localError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-700">
          {localError}
        </div>
      )}

      {/* Footer: security note + button */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <p className="flex-1">
            Payments are processed securely via Stripe. We never see or store
            your full card details.
          </p>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 text-white text-sm font-semibold tracking-wide py-3.5 shadow-sm hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing payment...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay ${Number(total || 0).toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
