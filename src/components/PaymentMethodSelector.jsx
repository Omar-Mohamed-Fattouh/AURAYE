export default function PaymentMethodSelector({ selected, register, error }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">Payment Method</label>
      <div className="flex gap-4">
        <label
          className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
            selected === "cod" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
          }`}
        >
          <input type="radio" {...register} value="cod" className="accent-blue-500" />
          Cash on Delivery
        </label>

        <label
          className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${
            selected === "CreditCard" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
          }`}
        >
          <input type="radio" {...register} value="CreditCard" className="accent-blue-500" />
          Credit Card
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
