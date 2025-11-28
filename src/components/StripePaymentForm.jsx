import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StripePaymentForm({
  total,
  onSuccess,
  isProcessing,
  setIsProcessing,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/success` },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      toast.success("Payment successful!");
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 shadow-md rounded-xl border"
    >
      <div className="p-4 bg-gray-50 rounded-lg border">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
}
