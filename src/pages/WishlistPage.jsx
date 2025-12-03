// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getWishlist } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      try {
        setLoading(true);
        const res = await getWishlist();

        // نحاول نغطي أكتر من شكل للريسبونس
        let data = res.data;

        // إذا backend بيرجع { data: [...] }
        if (data && Array.isArray(data.data)) {
          data = data.data;
        }

        if (!Array.isArray(data)) {
          data = [];
        }

        // بعض الـ APIs بترجع { id, product: {...} }
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
  }, []);

  const token = localStorage.getItem("token");

  // --------------------------- RENDER ---------------------------

  if (!token) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
        <p className="text-gray-600 mb-4">
          You need to log in to view your wishlist.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white hover:opacity-90 text-sm"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
        <p className="text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
        <p className="text-gray-600 mb-4">
          Your wishlist is empty. Start adding products you love!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 rounded-md bg-black text-white hover:opacity-90 text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      <p className="text-gray-600 mb-6">
        Items you’ve added to your wishlist.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            linkTo={`/products/${product.id}`}
            showAddToCart={true}
          />
        ))}
      </div>
    </div>
  );
}
