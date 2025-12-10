// src/pages/Ar.jsx
import { useContext, useEffect, useState } from "react";
import { Heart, Sparkles, ScanFace } from "lucide-react";
import { toast } from "sonner";

import { getProductsAr } from "../api/productsApi";
import {
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "../api/productsApi";
import { CartContext } from "../store/cartContext";
import { AuthContext } from "../features/auth/AuthContext";

import TryOnModal from "../components/TryOnModal";

export default function Ar() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [selectedModel, setSelectedModel] = useState(null); // { url, defaultScale, productName }

  const { refreshCounts } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);

  // Load products
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductsAr();
        setProducts(data);

        if (isLoggedIn) {
          const ids = new Set();
          await Promise.all(
            data.map(async (p) => {
              try {
                const res = await isProductInWishlist(p.id);
                const exists =
                  res.data === true ||
                  res.data === "true" ||
                  (typeof res.data === "object" && res.data?.exists === true);

                if (exists) ids.add(p.id);
              } catch (err) {
                console.error("Wishlist check failed for product", p.id, err);
              }
            })
          );
          setWishlistedIds(ids);
        } else {
          setWishlistedIds(new Set());
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isLoggedIn]);

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (!isLoggedIn) {
      toast.error("You need to log in to use the wishlist.");
      return;
    }

    const isWishlisted = wishlistedIds.has(productId);

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        const newSet = new Set(wishlistedIds);
        newSet.delete(productId);
        setWishlistedIds(newSet);
        toast.success("Removed from wishlist.");
      } else {
        await addToWishlist(productId);
        const newSet = new Set(wishlistedIds);
        newSet.add(productId);
        setWishlistedIds(newSet);
        toast.success("Added to wishlist.");
      }

      if (typeof refreshCounts === "function") {
        await refreshCounts();
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to update wishlist.");
      }
    }
  };

  // فتح الـ Try-On
  const handleOpenTryOn = (product) => {
    if (!product.models || product.models.length === 0) {
      toast.error("3D model is not available for this product yet.");
      return;
    }

    const mainModel = product.models[0];
    const rawUrl = mainModel.url || "";
    const cleanedUrl = rawUrl.includes("?") ? rawUrl.split("?")[0] : rawUrl;

    setSelectedModel({
      url: cleanedUrl,
      defaultScale: mainModel.defaultScale || 1,
      productName: product.name,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/95 to-black px-4 sm:px-6 lg:px-12 py-8 sm:py-10 text-white">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/15 text-[11px] uppercase tracking-[0.15em]">
            <ScanFace className="w-3 h-3" />
            <span>Live AR Try-On</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <span>Virtual Try-On Collection</span>
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed text-white/80">
            Browse our eyewear collection and instantly try frames on your face
            using your camera and real-time 3D models.
          </p>
        </div>
      </header>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] sm:h-[340px] md:h-[360px] rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Products grid */}
      {!loading && (
        <>
          {products.length === 0 ? (
            <p className="text-center text-white/80 mt-12 text-sm">
              No products available at the moment.
            </p>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product) => {
                const colors = Array.from(
                  new Set(
                    (product.images || [])
                      .map((img) => img.color)
                      .filter(Boolean)
                  )
                );

                const hasDiscount =
                  product.oldPrice &&
                  Number(product.oldPrice) > Number(product.price);

                const discountPercent = hasDiscount
                  ? Math.round(
                      ((Number(product.oldPrice) - Number(product.price)) /
                        Number(product.oldPrice)) *
                        100
                    )
                  : 0;

                const isWishlisted = wishlistedIds.has(product.id);

                return (
                  <div
                    key={product.id}
                    className="
                      group relative flex flex-col
                      rounded-2xl border border-white/12 bg-white/5
                      backdrop-blur-md shadow-lg 
                      hover:shadow-2xl hover:-translate-y-1.5
                      transition-transform transition-shadow duration-200
                      overflow-hidden
                    "
                  >
                    {/* Wishlist */}
                    <button
                      className="absolute top-3 right-3 hover:bg-white/10 transition p-2 rounded-full z-10"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        size={20}
                        className={isWishlisted ? "text-red-400" : "text-black/80"}
                        fill={isWishlisted ? "red" : "none"}
                      />
                    </button>

                    {/* Image */}
                    <div className="w-full px-3 pt-5">
                      <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-xl bg-white/5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 opacity-70 group-hover:opacity-100 transition" />
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="relative w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4 pt-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-[13px] sm:text-sm uppercase tracking-wide text-white h-[36px] overflow-hidden">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-white/80 h-[34px] overflow-hidden mt-1">
                        {product.description ||
                          "High-quality eyewear designed for everyday comfort and style."}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2 text-[12px] sm:text-[13px]">
                        {hasDiscount && (
                          <span className="line-through text-white/60">
                            EGP {Number(product.oldPrice).toLocaleString()}
                          </span>
                        )}

                        <span className="text-white font-bold">
                          EGP {Number(product.price).toLocaleString()}
                        </span>

                        {hasDiscount && (
                          <span className="text-red-400 text-[11px] font-semibold">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Colors */}
                      <div className="flex items-center gap-1 mt-2">
                        {colors.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-white/50"
                            style={{ backgroundColor: c }}
                          />
                        ))}

                        {colors.length > 3 && (
                          <span className="text-white/80 text-[11px] ml-1">
                            +{colors.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Try-On button */}
                      <div className="mt-auto pt-3">
                        <button
                          onClick={() => handleOpenTryOn(product)}
                          className="
                            w-full inline-flex items-center justify-center gap-2
                            text-[11px] sm:text-xs font-medium
                            rounded-xl py-2.5 px-3
                            bg-white text-black
                            hover:bg-white/85
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                            transition
                          "
                        >
                          <ScanFace size={16} />
                          <span>Try On in AR</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </>
      )}

      {/* AR Try-On Popup */}
      {selectedModel && (
        <TryOnModal
          modelUrl={selectedModel.url}
          defaultScale={selectedModel.defaultScale}
          productName={selectedModel.productName}
          onClose={() => setSelectedModel(null)}
        />
      )}
    </div>
  );
}
