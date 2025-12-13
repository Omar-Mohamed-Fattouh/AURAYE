// src/components/DealsSection.jsx
import { useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

export default function DealsSection({ products = [], loading = false }) {
  const deals = useMemo(() => {
    return (products || []).filter(
      (p) =>
        p.oldPrice !== null &&
        p.oldPrice !== undefined &&
        Number(p.oldPrice) > Number(p.price)
    );
  }, [products]);

  if (loading) return null;
  if (!deals || deals.length === 0) return null;

  return (
    <section className="relative pt-10 bg-white">
      <div className="container mx-auto px-6">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-6xl border-t border-gray-300" />

        <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-2">
          Exclusive Eyewear Offers
        </h2>

        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          Discover our latest collection of eyeglasses and accessories at
          special prices. Find the perfect style that suits your look.
        </p>

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
          navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
          spaceBetween={20}
          slidesPerView={5}
          loop={deals.length > 5}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="pb-10"
        >
          {deals.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard
                product={p}
                linkTo={`/products/${p.id}`}
                showAddToCart={false}
                badge="Deal"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
