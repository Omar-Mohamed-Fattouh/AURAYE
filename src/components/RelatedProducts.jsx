// RelatedProducts.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import {
  getProducts,
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "../api/productsApi";

import "swiper/css";
import "swiper/css/navigation";

export default function RelatedProducts() {
  const { id } = useParams();
  const [related, setRelated] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const products = await getProducts();

        // المنتج الحالي
        const current = products.find((p) => Number(p.id) === Number(id));
        if (!current) {
          setRelated([]);
          return;
        }

        // نفس الكاتيجوري + استبعاد المنتج الحالي
        const filtered = products.filter(
          (p) =>
            p.category === current.category &&
            Number(p.id) !== Number(current.id)
        );

        const relatedProducts = filtered.slice(0, 10);
        setRelated(relatedProducts);

        // ✅ Sync wishlist للـ related بس
        const token = localStorage.getItem("token");
        if (!token) {
          setWishlistIds([]);
          return;
        }

        const checks = await Promise.all(
          relatedProducts.map((p) =>
            isProductInWishlist(p.id).catch(() => ({ data: false }))
          )
        );

        const inWishlist = relatedProducts
          .filter((p, idx) => {
            const res = checks[idx];
            const data = res.data;
            return (
              data === true ||
              data === "true" ||
              (typeof data === "object" && data?.exists === true)
            );
          })
          .map((p) => p.id);

        setWishlistIds(inWishlist);
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    };

    if (id) {
      loadRelated();
    }
  }, [id]);

  const handleToggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in to use the wishlist.");
      return;
    }

    const isWishlisted = wishlistIds.includes(productId);

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.success("Product removed from wishlist.");
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
        toast.success("Product added to wishlist.");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data;

      if (
        !isWishlisted &&
        err.response?.status === 400 &&
        typeof msg === "string" &&
        msg.toLowerCase().includes("already exists in wishlist")
      ) {
        setWishlistIds((prev) =>
          prev.includes(productId) ? prev : [...prev, productId]
        );
        toast.info("Product is already in your wishlist.");
        return;
      }

      if (err.response?.status === 401) {
        toast.error("You need to log in to use the wishlist.");
      } else {
        toast.error("Failed to update wishlist.");
      }
    }
  };

  if (!related || related.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-2">
          Related Products
        </h2>

        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          Discover more frames that match your style and category.
        </p>

        {/* نفس ستايل الزراير بتوع Deals بس كلاسات مختلفة عشان مايتخبطوش */}
        <div className="flex justify-end gap-4 mb-4">
          <button className="related-prev p-2 border rounded-full hover:bg-gray-100">
            <ChevronLeft size={22} />
          </button>
          <button className="related-next p-2 border rounded-full hover:bg-gray-100">
            <ChevronRight size={22} />
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".related-next",
            prevEl: ".related-prev",
          }}
          spaceBetween={20}
          slidesPerView={5}
          loop={related.length > 5}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="pb-10"
        >
          {related.map((p) => {
            const isWishlisted = wishlistIds.includes(p.id);

            // ألوان من الصور زي ما عملنا في Deals
            const colors = Array.from(
              new Set(
                (p.images || [])
                  .map((img) => img.color)
                  .filter(Boolean)
              )
            );

            const hasDiscount =
              p.oldPrice && Number(p.oldPrice) > Number(p.price);
            const discountPercent = hasDiscount
              ? Math.round(
                  ((Number(p.oldPrice) - Number(p.price)) /
                    Number(p.oldPrice)) *
                    100
                )
              : 0;

            return (
              <SwiperSlide key={p.id}>
                {/* 👇 نفس الكارت بتاع Deals بالظبط */}
                <Link
                  to={`/products/${p.id}`}
                  className="
                    bg-white transition p-4 relative 
                    flex flex-col 
                    h-[360px] 
                    rounded-xl  
                  "
                >
                  {/* Heart Button */}
                  <button
                    className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm z-10 border ${
                      isWishlisted ? "border-red-500" : "border-transparent"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleWishlist(p.id);
                    }}
                  >
                    <Heart
                      size={18}
                      className={
                        isWishlisted ? "text-red-500" : "text-gray-700"
                      }
                      fill={isWishlisted ? "red" : "none"}
                    />
                  </button>

                  {/* Image */}
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="w-full h-36 object-contain mb-4"
                  />

                  {/* Product Title */}
                  <h3 className="font-bold text-gray-900 text-sm uppercase h-[38px] overflow-hidden">
                    {p.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs h-[36px] overflow-hidden">
                    {p.description ||
                      "High-quality eyeglasses for everyday use."}
                  </p>

                  {/* Prices */}
                  <div className="flex items-center gap-2 mt-2">
                    {hasDiscount && (
                      <span className="line-through text-gray-400 text-sm">
                        EGP {Number(p.oldPrice).toLocaleString()}
                      </span>
                    )}

                    <span className="text-red-600 font-bold text-base">
                      EGP {Number(p.price).toLocaleString()}
                    </span>

                    {hasDiscount && (
                      <span className="text-red-600 text-sm font-semibold">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Colors (من الصور) */}
                  <div className="flex items-center gap-1 mt-1">
                    {colors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full "
                        style={{ backgroundColor: c }}
                      ></span>
                    ))}

                    {colors.length > 3 && (
                      <span className="text-gray-500 text-xs ml-1">
                        +{colors.length - 3}
                      </span>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
