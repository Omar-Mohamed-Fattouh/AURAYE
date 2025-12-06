// src/components/CODPaymentForm.jsx
import { useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

export const CODPaymentForm = ({
  total,
  onSuccess,
  isProcessing,
  setIsProcessing,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      toast.success("Order placed successfully! Payment due on delivery.");
      onSuccess?.();
    }, 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 md:p-7 shadow-lg rounded-2xl border border-slate-100 max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Cash on delivery
          </h2>
          <p className="text-xs text-slate-500">
            You will pay {total.toFixed(2)} when your order arrives.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          id="fullName"
          name="fullName"
          label="Full name"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
        />
        <Input
          id="phone"
          name="phone"
          label="Phone number"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          id="address"
          name="address"
          label="Delivery address"
          placeholder="123 Main St, City, State 12345"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-full hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Place order - ${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

function Input({ id, label, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-600"
      >
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none"
      />
    </div>
  );
}
