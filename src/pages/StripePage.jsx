// src/pages/StripePage.jsx
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import StripePaymentForm from "../components/StripePaymentForm";
import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";
export default function StripePage({ stripePromise }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // نتوقع إن الـ state جاية من /checkout → createPaymentIntent
  const { clientSecret, total, formData } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);

  const appearance = useMemo(
    () => ({
      theme: "stripe",
      variables: {
        borderRadius: "12px",
        colorPrimary: "#111827",
        colorBackground: "#ffffff",
        colorText: "#111827",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    }),
    []
  );

  if (!clientSecret || !total) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-slate-100 p-8 text-center space-y-4">
          <h1 className="text-xl font-semibold text-slate-900">
            No payment information
          </h1>
          <p className="text-sm text-slate-500">
            We couldn&apos;t find a payment session. Please go back to your cart
            and start checkout again.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900 transition"
          >
            Back to cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
      }}
    >
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <main className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)] items-start">
          {/* LEFT: Payment form */}
          <section className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Secure payment
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Complete your purchase with encrypted card details. No extra steps,
                no surprises.
              </p>
            </div>

            <StripePaymentForm
              total={total}
              customerInfo={formData}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              onSuccess={() => navigate("/success")}
            />
          </section>

          {/* RIGHT: Order summary */}
          <aside className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-7 space-y-5">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500">
                Order summary
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Check your details before confirming your payment.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              {formData?.fullName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium text-slate-900">
                    {formData.fullName}
                  </span>
                </div>
              )}

              {formData?.email && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-900">
                    {formData.email}
                  </span>
                </div>
              )}

              {formData?.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium text-slate-900">
                    {formData.phone}
                  </span>
                </div>
              )}

              {(formData?.street || formData?.city || formData?.country) && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    Shipping address
                  </p>
                  <p className="text-sm text-slate-800">
                    {[formData.street, formData.city, formData.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount to pay</span>
                <span className="text-lg font-bold text-slate-900">
                  EGP {Number(total || 0).toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Your card will be charged in Egyptian Pounds. All payments are
                processed securely via Stripe.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </Elements>
  );
}
