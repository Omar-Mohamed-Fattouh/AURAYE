import { useEffect, useState } from "react";
import { addRandomDiscounts } from "../utils/addRandomDiscounts";
import { getProducts } from "../api/productsApi";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function DealsSection() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const loadDeals = async () => {
      const products = await getProducts();
      const discounted = addRandomDiscounts(products);

      // نخلي السكشن يعرض المنتجات اللي فعلاً عليها خصم فقط
      const dealsOnly = discounted.filter((p) => p.oldPrice !== null);

      setDeals(dealsOnly);
    };

    loadDeals();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        
        {/* SECTION HEADER */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🔥 Best Deals Today
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                />

                {/* DISCOUNT BADGE */}
                {p.discountPercent && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                    -{p.discountPercent}%
                  </span>
                )}

                {/* VIEW DETAILS */}
                <Link
                  to={`/product/${p.id}`}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/40 text-white transition"
                >
                  <Eye size={22} className="mr-2" /> View Details
                </Link>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.name}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {p.description || "High-quality eyewear with premium design."}
                </p>

                {/* PRICE */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold text-gray-900">
                    ${p.price}
                  </span>

                  {p.oldPrice && (
                    <span className="line-through text-gray-500 text-sm">
                      ${p.oldPrice}
                    </span>
                  )}
                </div>

                {/* BUTTONS */}
                <button className="w-full bg-gray-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 mt-3 hover:bg-black transition">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* NO DEALS MESSAGE */}
        {deals.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No deals available right now. Please check back later!
          </p>
        )}
      </div>
    </section>
  );
}
