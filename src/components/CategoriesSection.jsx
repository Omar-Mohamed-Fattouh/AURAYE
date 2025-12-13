import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const categories = [
  { name: "SUN", route: "/products/sunglasses", image: "/Sunglasses.jpg" },
  { name: "OPTICAL", route: "/products/eyeglasses", image: "/Eyeglasses.jpg" },
  { name: "MEN", route: "/products/men", image: "/mens.jpg" },
  { name: "WOMEN", route: "/products/women", image: "/woman.jpg" },
  { name: "ALL PRODUCTS", route: "/products/products", image: "/all.jpg" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      {/* Title */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
          Explore Our Categories
        </h2>
        <p className="text-gray-600 mt-3 text-sm md:text-base max-w-xl mx-auto">
          Find the perfect eyewear that matches your style and personality
        </p>
      </div>

      {/* Slider */}
      <div className="container mx-auto px-4">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 2.1, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 24 },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.name}>
              <div
                onClick={() => navigate(category.route)}
                className="
                  relative cursor-pointer overflow-hidden rounded-2xl
                  bg-gray-100 shadow-md hover:shadow-2xl
                  transition-all duration-300 group h-full
                "
              >
                {/* Image */}
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlay gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className="
                      inline-flex items-center px-3 py-1 rounded-full
                      bg-white/90 text-[11px] md:text-xs font-semibold
                      tracking-[0.18em] uppercase text-gray-900
                      shadow-sm
                    "
                  >
                    {category.name}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
