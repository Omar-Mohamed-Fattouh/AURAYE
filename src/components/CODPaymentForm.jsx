import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export const CODPaymentForm = ({ total, onSuccess, isProcessing, setIsProcessing }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill in all fields")
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      toast.success("Order placed successfully! Payment due on delivery.")
      onSuccess()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-md rounded-xl border">
      <div className="p-4 bg-blue-100 text-blue-900 rounded-lg border border-blue-200">
        <p className="text-sm">
          <strong>Cash on Delivery:</strong> You will pay ${total.toFixed(2)} when your order arrives.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">Delivery Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="123 Main St, City, State 12345"
            value={formData.address}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Place Order - $${total.toFixed(2)}`
        )}
      </button>
    </form>
  )
}
