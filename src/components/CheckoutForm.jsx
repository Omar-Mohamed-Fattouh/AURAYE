// src/components/CheckoutForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "../forms/checkoutSchema";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { formatEGP } from "../components/formatCurrency";
import { CreditCard, MapPin, User2, Phone, Mail } from "lucide-react";
import { cloneElement } from "react";

export default function CheckoutForm({
  onSubmit,
  isProcessing,
  cartItems = [],
  subtotal = 0,
  total = 0,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "Omar Fattouh",
      email: "omar@example.com",
      phone: "+201234567890",
      country: "Egypt",
      city: "Ismailia",
      street: "Ismailia street",
      paymentMethod: "cod",
    },
  });
const BASE_URL = 'https://graduation-project1.runasp.net'
  const selectedPayment = watch("paymentMethod");

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gradient-to-r from-emerald-50 via-slate-50 to-slate-50">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Checkout
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Complete your details to place your order securely.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Secure payment & encrypted checkout</span>
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6 md:gap-8 px-6 md:px-8 py-6 md:py-8"
        >
          {/* LEFT: CUSTOMER + ADDRESS + PAYMENT */}
          <div className="space-y-6">
            {/* Customer info */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <User2 className="w-4 h-4 text-emerald-600" />
                  Contact information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  We’ll use these details to contact you about your order.
                </p>
              </div>

              <div className="space-y-4">
                <Field
                  label="Full Name"
                  error={errors.fullName?.message}
                  icon={User2}
                >
                  <input {...register("fullName")} className={inputClass} />
                </Field>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label="Email"
                    error={errors.email?.message}
                    icon={Mail}
                  >
                    <input
                      type="email"
                      {...register("email")}
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Phone"
                    error={errors.phone?.message}
                    icon={Phone}
                  >
                    <input {...register("phone")} className={inputClass} />
                  </Field>
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Shipping address
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your order will be shipped to this address.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field
                  label="Country"
                  error={errors.country?.message}
                >
                  <input {...register("country")} className={inputClass} />
                </Field>
                <Field
                  label="City"
                  error={errors.city?.message}
                >
                  <input {...register("city")} className={inputClass} />
                </Field>
                <Field
                  label="Street"
                  error={errors.street?.message}
                >
                  <input {...register("street")} className={inputClass} />
                </Field>
              </div>
            </section>

            {/* Payment method */}
            <section className="space-y-4">
              <PaymentMethodSelector
                selected={selectedPayment}
                register={register("paymentMethod")}
                error={errors.paymentMethod}
              />
            </section>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full text-sm font-semibold tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Place order"}
              </button>
              <p className="mt-2 text-[11px] text-slate-500 text-center">
                By placing your order, you agree to our Terms & Conditions and
                Privacy Policy.
              </p>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 md:p-5 space-y-4 self-start">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Order summary
              </h3>
              <span className="text-xs text-slate-500">
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Items list */}
            <div className="space-y-3 max-h-64  pr-1">
              {cartItems.map((item) => {
                const name =
                  item.title || item.productName || item.name || "Item";
                const price = item.unitPrice ?? item.price ?? 0;
                const image =
                  BASE_URL +
                  (item.imageUrl || item.productImage || item.imgUrl || null);

                return (
                  <div
                    key={item.cartItemId ?? item.id ?? name}
                    className="flex gap-3"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 px-2 text-center">
                            No image
                          </span>
                        )}
                      </div>
                      <span className="absolute  -top-1 -right-1 bg-slate-900 text-white text-[10px] rounded-full px-1.5 py-0.5">
                        {item.quantity ?? 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 line-clamp-1">
                        {name}
                      </p>
                      {item.color && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Color:{" "}
                          <span className="capitalize">{item.color}</span>
                        </p>
                      )}
                      <p className="text-xs font-semibold text-slate-900 mt-1">
                        {formatEGP(price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
              <Row label="Subtotal" value={formatEGP(subtotal)} />
              {/* لو عندك شحن/ضريبة من الـ backend تقدر تضيفهم هنا */}
              <Row label="Shipping" value="Calculated at delivery" />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs uppercase text-slate-500 tracking-[0.18em]">
                Total
              </span>
              <span className="text-xl font-bold text-slate-900">
                {formatEGP(total)}
              </span>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {Icon
          ? cloneElement(children, {
              className: `${children.props.className} pl-9`,
            })
          : children}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
}

// helper row for summary
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-slate-700">
      <span className="text-xs">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
