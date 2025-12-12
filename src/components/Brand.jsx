import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const brands = ["./logo.png", "./logo.png", "./logo.png", "./logo.png", "./logo.png", "./logo.png", "./logo.png", "./logo.png", "./logo.png"];

export default function BrandCarousel() {
  return (
    <div className="w-full py-5 px-20 lg:px-50">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={6}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 5, spaceBetween: 10 },
        }}
      >
        {brands.map((logo, i) => (
          <SwiperSlide key={i}>
            <div className="flex justify-center items-center">
              <div className="border border-transparent rounded-full px-[42px] py-[17.5px] transition-all duration-300 hover:scale-105 hover:bg-white/5">
                <img
                  src={logo}
                  alt="Brand Logo"
                  className="max-w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
