import { useEffect, useState } from "react";
import { addRandomDiscounts } from "../utils/addRandomDiscounts";
import { getProducts, addToCart } from "../api/productsApi";
import { Heart, ChevronRight, ChevronLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function DealsSection() {
  const [deals, setDeals] = useState([]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        productId: productId,
        quantity: 1,
      });
      console.log("Added to cart!");
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  useEffect(() => {
    const loadDeals = async () => {
      const products = await getProducts();
      const discounted = addRandomDiscounts(products);

      const dealsOnly = discounted.filter((p) => p.oldPrice !== null);
      setDeals(dealsOnly);
    };

    loadDeals();
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6">
        {/* Improved Text */}
        <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-2">
          Exclusive Eyewear Offers
        </h2>

        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          Discover our latest collection of eyeglasses and accessories at special prices. Find the perfect style that suits your look.
        </p>

        {/* CUSTOM NAV BUTTONS */}
        <div className="flex justify-end gap-4 mb-4">
          <button className="swiper-prev p-2 border rounded-full hover:bg-gray-100">
            <ChevronLeft size={22} />
          </button>
          <button className="swiper-next p-2 border rounded-full hover:bg-gray-100">
            <ChevronRight size={22} />
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
          }}
          spaceBetween={20}
          slidesPerView={5}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="pb-10"
        >
          {deals.map((p) => (
            <SwiperSlide key={p.id}>
              <div
                className="
                  bg-white transition p-4 relative 
                  flex flex-col 
                  h-[360px] 
                  rounded-xl  
                "
              >
                {/* Heart Button */}
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
                  <Heart size={18} className="text-gray-700" />
                </button>

                {/* Image */}
                <Link to={`/product/${p.id}`}>
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-36 object-contain mb-4"
                  />
                </Link>

                {/* Product Title */}
                <h3 className="font-bold text-gray-900 text-sm uppercase line-clamp- h-[38px]">
                  {p.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-xs line-clamp- h-[36px]">
                  {p.description || "High-quality eyeglasses for everyday use."}
                </p>

                {/* Prices */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="line-through text-gray-400 text-sm">
                    EGP {Number(p.oldPrice).toLocaleString()}
                  </span>

                  <span className="text-red-600 font-bold text-base">
                    EGP {Number(p.price).toLocaleString()}
                  </span>

                  <span className="text-red-600 text-sm font-semibold">
                    -{p.discountPercent}%
                  </span>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1 mt-1">
                  {p.colors?.slice(0, 3).map((c, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: c }}
                    ></span>
                  ))}

                  {p.colors?.length > 3 && (
                    <span className="text-gray-500 text-xs ml-1">
                      +{p.colors.length - 3}
                    </span>
                  )}
                </div>
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(p.id)}
                  className="
                    mt-auto w-full bg-black text-white 
                    py-2 rounded-lg text-sm font-semibold 
                    flex items-center justify-center gap-2 
                    hover:bg-black/80 transition
                  "
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
