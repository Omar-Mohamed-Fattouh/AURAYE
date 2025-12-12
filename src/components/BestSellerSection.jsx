// src/components/BestSellerSection.jsx
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

export default function BestSellerSection({ products = [], loading = false }) {
  if (loading) return null;
  if (!products || products.length === 0) return null;

  return (
    <section className="relative pt-10 bg-white">
      <div className="container mx-auto px-6">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-6xl border-t border-gray-300" />

        <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-2">
          Best Sellers
        </h2>

        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          Discover our top-rated frames, carefully selected and trusted by
          thousands of customers.
        </p>

        <div className="flex justify-end gap-4 mb-4">
          <button className="bestseller-prev p-2 border rounded-full hover:bg-gray-100">
            <ChevronLeft size={22} />
          </button>
          <button className="bestseller-next p-2 border rounded-full hover:bg-gray-100">
            <ChevronRight size={22} />
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{ nextEl: ".bestseller-next", prevEl: ".bestseller-prev" }}
          spaceBetween={20}
          slidesPerView={5}
          loop={products.length > 5}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="pb-10"
        >
          {products.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard
                product={p}
                linkTo={`/products/${p.id}`}
                showAddToCart={false}
                badge="Best Seller"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
