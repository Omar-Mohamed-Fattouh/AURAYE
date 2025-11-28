import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../components/StripePaymentForm";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function StripePage({ stripePromise }) {
  const location = useLocation();
  const { stripeData, formData, total, clientSecret } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  console.log(total);

  if (!clientSecret)
    return <p className="text-center mt-20">No payment info found.</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <StripePaymentForm
          total={total}
          customerInfo={formData}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          onSuccess={() => console.log("Payment Successful")}
        />
      </div>
    </Elements>
  );
}
