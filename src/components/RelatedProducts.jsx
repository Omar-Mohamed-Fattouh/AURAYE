import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronRight, ChevronLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentProduct, products = [] }) {
  const related = useMemo(() => {
    if (!currentProduct || !Array.isArray(products) || products.length === 0) return [];

    const currentId = Number(currentProduct.id);
    const currentCategory =
      typeof currentProduct.category === "string"
        ? currentProduct.category
        : currentProduct.category?.name;

    // handle category as string or object in products list
    const getCat = (p) =>
      typeof p.category === "string" ? p.category : p.category?.name;

    return products
      .filter((p) => {
        const cat = getCat(p);
        return (
          String(cat || "").toLowerCase().trim() ===
            String(currentCategory || "").toLowerCase().trim() &&
          Number(p.id) !== currentId
        );
      })
      .slice(0, 10);
  }, [currentProduct, products]);

  if (!related || related.length === 0) return null;

  return (
    <section className="relative pt-10 bg-white">
      <div className="container mx-auto px-6">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-6xl border-t border-gray-300" />

        <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-2">
          Related Products
        </h2>

        <p className="text-gray-600 text-center text-sm md:text-base mb-6">
          Discover more frames that match your style and category.
        </p>

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
          navigation={{ nextEl: ".related-next", prevEl: ".related-prev" }}
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
          {related.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard
                product={p}
                linkTo={`/products/${p.id}`}
                showAddToCart={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
