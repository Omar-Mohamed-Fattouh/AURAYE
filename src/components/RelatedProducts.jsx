// RelatedProducts.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { getProducts } from "../api/productsApi";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";

export default function RelatedProducts() {
  const { id } = useParams();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const products = await getProducts();

        const current = products.find((p) => Number(p.id) === Number(id));
        if (!current) {
          setRelated([]);
          return;
        }

        const filtered = products.filter(
          (p) =>
            p.category === current.category &&
            Number(p.id) !== Number(current.id)
        );

        setRelated(filtered.slice(0, 10));
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    };

    if (id) {
      loadRelated();
    }
  }, [id]);

  if (!related || related.length === 0) return null;

  return (
    <section className="py-5 bg-white">
      <div className="container mx-auto px-6">
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
          {related.map((p) => (
            <SwiperSlide key={p.id}>
              <ProductCard
                product={p}
                linkTo={`/products/${p.id}`}
                showAddToCart={false}   // Related من غير Add to Cart
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
