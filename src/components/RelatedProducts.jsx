// RelatedProducts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Heart, ChevronRight, ChevronLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { getProducts, addToCart } from "../api/productsApi";

import "swiper/css";
import "swiper/css/navigation";

export default function RelatedProducts({ currentProductId, currentCategory }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const products = await getProducts();

        // نفس الكاتيجوري + استبعاد المنتج الحالي
        const filtered = products.filter(
          (p) =>
            p.category === currentCategory &&
            Number(p.id) !== Number(currentProductId)
        );

        // ممكن نكتفي مثلاً بـ 10 بس
        setRelated(filtered.slice(0, 10));
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    };

    if (currentCategory && currentProductId) {
      loadRelated();
    }
  }, [currentProductId, currentCategory]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    if (!isLoggedIn) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }

    try {
      await addToCart({
        productId: productId,
        quantity: 1,
      });
      toast.success("Product added to cart.");
    } catch (err) {
      console.error("Cart error:", err);
      const msg = err.response?.data;

      if (
        err.response?.status === 400 &&
        typeof msg === "string" &&
        msg.toLowerCase().includes("already")
      ) {
        toast.info("This product is already in your cart.");
      } else if (err.response?.status === 401) {
        toast.error("You need to log in to add items to the cart.");
      } else {
        toast.error("Failed to add product to cart.");
      }
    }
  };

  // لو مفيش منتجات متعلقة خالص، مش هنظهر السيكشن
  if (!related || related.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6">
        {/* Title */}
        <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-2">
          Related Products
        </h2>

        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          Discover more frames that match your style and category.
        </p>

        {/* CUSTOM NAV BUTTONS (خاصة بالـ Related فقط) */}
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
            // ألوان من الصور (لو الباك مديكي color في كل image)
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
                <div
                  className="
                    bg-white transition p-4 relative 
                    flex flex-col 
                    h-[380px] 
                    rounded-xl  
                    shadow-sm hover:shadow-md
                  "
                >
                  {/* Heart Button (لسه بدون لوجيك Wishlist) */}
                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm z-10"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart size={18} className="text-gray-700" />
                  </button>

                  {/* Clickable Product Area */}
                  <Link
                    to={`/products/${p.id}`}
                    className="flex flex-col flex-1"
                  >
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

                    {/* Colors */}
                    <div className="flex items-center gap-1 mt-1">
                      {colors.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border"
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

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    className="mt-3 flex items-center justify-center gap-2 text-sm bg-black text-white py-2 px-3 rounded-md hover:opacity-90"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
