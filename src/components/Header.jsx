import { Store, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Store className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">ShopFlow</span>
        </Link>

        <Link
          to="/cart"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-sm font-medium">Cart</span>
        </Link>
      </div>
    </header>
  )
}
