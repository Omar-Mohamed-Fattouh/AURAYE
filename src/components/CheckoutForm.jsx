import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "../forms/checkoutSchema";
import PaymentMethodSelector from "./PaymentMethodSelector";

export default function CheckoutForm({ onSubmit, isProcessing }) {
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
      country: "egypt",
      city: "ismailia",
      street: "ismailia street",
      paymentMethod: "cod",
    },
  });

  const selectedPayment = watch("paymentMethod");

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center">Checkout</h2>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input {...register("fullName")} className={inputClass} />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input type="email" {...register("email")} className={inputClass} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-600">Phone</label>
          <input {...register("phone")} className={inputClass} />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputBox label="Country" register={register("country")} error={errors.country} />
          <InputBox label="City" register={register("city")} error={errors.city} />
          <InputBox label="Street" register={register("street")} error={errors.street} />
        </div>

        {/* Payment Method */}
        <PaymentMethodSelector
          selected={selectedPayment}
          register={register("paymentMethod")}
          error={errors.paymentMethod}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

function InputBox({ label, register, error }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input {...register} className="w-full border rounded-lg p-3" />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
