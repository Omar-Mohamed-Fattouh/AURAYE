// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getWishlist, removeFromWishlist } from "../api/productsApi";
import ProductCard from "./ProductCard";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null); // للـ popup

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

        let data = res.data;

        // لو backend بيرجع { data: [...] }
        if (data && Array.isArray(data.data)) {
          data = data.data;
        }

        if (!Array.isArray(data)) {
          data = [];
        }

        // نعمل mapping لنفس فورمات getProducts
        const BASE_URL = "http://graduation-project1.runasp.net";

        const mappedProducts = data.map((p) => {
          const images =
            p.productImages && p.productImages.length > 0
              ? p.productImages.map((img) => ({
                  url: BASE_URL + img.imgUrl,
                  color: img.color || "Default",
                }))
              : [{ url: p.defaultImgUrl, color: "Default" }];

          return {
            id: p.productId,
            name: p.title,
            description: p.description,
            price: p.price,
            sizes: p.sizes || [],
            stockQuantity: p.stockQuantity,
            images,
            oldPrice: p.oldPrice || null,
            category: p.category?.name || "Other",
            gender: p.gender || "Unisex",
            shape: p.shape || "Standard",
            frameMaterial: p.frameMaterial || "Standard",
          };
        });

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

  // لما يضغط على "Remove from wishlist" نفتح popup
  function askRemove(productId) {
    setConfirmId(productId);
  }

  // تأكيد الحذف
  async function handleConfirmRemove() {
    if (!confirmId) return;

    try {
      await removeFromWishlist(confirmId);
      setProducts((prev) =>
        prev.filter((p) => Number(p.id) !== Number(confirmId))
      );
      toast.success("Product removed from wishlist.");
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      toast.error("Failed to remove product from wishlist.");
    } finally {
      setConfirmId(null);
    }
  }

  // إلغاء الـ popup
  function handleCancelRemove() {
    setConfirmId(null);
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
                showAddToCart={false} // مفيش Add to Cart في الصفحة دي
              />

              {/* زرار الحذف تحت الكارت (يفتح popup) */}
              <button
                onClick={() => askRemove(product.id)}
                className="
                  -mt-4 inline-flex items-center justify-center 
                  text-xs font-medium
                  px-3 py-1.5 rounded-full
                  border border-gray-300 text-gray-700
                  hover:border-black hover:bg-gray-50
                  transition z-10
                "
              >
                Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup تأكيد الحذف */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Remove item from wishlist?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to remove this item from your wishlist?
              <br />
              You can always add it again later.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:opacity-90 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
