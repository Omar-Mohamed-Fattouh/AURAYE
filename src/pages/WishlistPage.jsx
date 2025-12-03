// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getWishlist, removeFromWishlist } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      try {
        setLoading(true);
        const res = await getWishlist();

        // نغطي كذا شكل محتمل للريسبونس
        let data = res.data;

        // لو الـ backend رجّع { data: [...] }
        if (data && Array.isArray(data.data)) {
          data = data.data;
        }

        if (!Array.isArray(data)) {
          data = [];
        }

        // لو الآيتم جواه product
        const mappedProducts = data.map((item) => item.product || item);

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [token]);

  async function handleRemove(productId) {
    try {
      await removeFromWishlist(productId);
      setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(productId)));
      toast.success("Product removed from wishlist.");
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove product from wishlist.");
    }
  }

  // --------------------------- RENDER STATES ---------------------------

  if (!token) {
    return (
      <section className="min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold mb-3">My Wishlist</h1>
          <p className="text-gray-600 mb-6">
            You need to log in to view and manage your wishlist.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold mb-3">My Wishlist</h1>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-bold mb-3">My Wishlist</h1>
          <p className="text-gray-600 mb-6">
            Your wishlist is empty. Start adding products you love.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  // --------------------------- MAIN VIEW ---------------------------

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Items you’ve saved to view later or purchase when you’re ready.
            </p>
          </div>

          <div className="text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
            {products.length === 1
              ? "1 item in your wishlist"
              : `${products.length} items in your wishlist`}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard
                product={product}
                linkTo={`/products/${product.id}`}
                showAddToCart={false}   // ❌ مفيش Add to Cart هنا
              />

              {/* Remove button تحت الكارت */}
              <button
                onClick={() => handleRemove(product.id)}
                className="
                  mt-2 inline-flex items-center justify-center 
                  text-xs font-medium
                  px-3 py-1.5 rounded-full
                  border border-gray-300 text-gray-700
                  hover:border-black hover:bg-gray-50
                  transition
                "
              >
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
