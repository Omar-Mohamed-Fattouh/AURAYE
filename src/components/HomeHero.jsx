import React from "react";
import { Link } from "react-router-dom";
import { Eye, Sun, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

export default function HomeHero() {
  const leftCards = [
    {
      icon: <Eye className="w-8 h-8 text-black" />,
      title: "AR Virtual Try-On",
      color: "bg-white/70",
    },
    {
      icon: <Sun className="w-8 h-8 text-black" />,
      title: "Stylish Sunglasses",
      color: "bg-white/70",
    },
    {
      icon: <Heart className="w-8 h-8 text-black" />,
      title: "Customer Favorites",
      color: "bg-white/70",
    },
    {
      icon: <Globe className="w-8 h-8 text-black" />,
      title: "Global Availability",
      color: "bg-white/70",
    },
  ];

  const rightCards = [
    {
      icon: <Eye className="w-8 h-8 text-black" />,
      title: "Try Frames Instantly",
      color: "bg-white/70",
    },
    {
      icon: <Sun className="w-8 h-8 text-black" />,
      title: "UV Protection",
      color: "bg-white/70",
    },
    {
      icon: <Heart className="w-8 h-8 text-black" />,
      title: "Customer Rated Best",
      color: "bg-white/70",
    },
    {
      icon: <Globe className="w-8 h-8 text-black" />,
      title: "Ships Worldwide",
      color: "bg-white/70",
    },
  ];

  const motionVariants = {
    float: {
      y: [0, -15, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section className="w-full  bg-gray-50 py-10">
      {/* Top Text */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-6">
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
          Elevate Your Vision with Smart AR Try-On
        </h1>
        <p className="text-gray-500 uppercase tracking-wide text-sm md:text-base">
          AURAYE SUPREME EYEWEAR
        </p>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-6 lg:px-0 flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Left Cards - Desktop */}
        <div className="hidden lg:flex flex-col gap-8 flex-shrink-0">
          {leftCards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`flex items-center gap-4 p-5 rounded-xl ${card.color} text-black shadow-xl`}
              animate="float"
              variants={motionVariants}
            >
              <div className="p-3 rounded-full bg-white/20">{card.icon}</div>
              <h3 className="font-semibold">{card.title}</h3>
            </motion.div>
          ))}
        </div>

        <div className=" relative w-full h-[60vh] sm:h-[80vh] md:h-[90vh] lg:h-[100vh]">
          <img
            src="/VTOOO.jpg"
            alt="Virtual Try-On Hero"
            className="w-full h-full object-cover object-center  shadow-2xl rounded-2xl"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center gap-4 w-full max-w-2xl px-4">
            <Link
              to="/tryon"
              className="bg-black text-white px-6 py-3 rounded-lg text-[12px] md:text-xl font-semibold hover:bg-black/80 transition"
            >
              Try AR Experience
            </Link>
            <Link
              to="/tryon"
              className="bg-white text-black px-6 py-3 rounded-lg text-[12px] md:text-xl font-semibold hover:bg-black/80 transition"
            >
              Try AR Experience
            </Link>
          </div>
        </div>

        {/* Right Cards - Desktop */}
        <div className="hidden lg:flex flex-col gap-8 flex-shrink-0">
          {rightCards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`flex items-center gap-4 p-5 rounded-xl ${card.color} text-black shadow-xl`}
              animate="float"
              variants={motionVariants}
            >
              <div className="p-3 rounded-full bg-white/20">{card.icon}</div>
              <h3 className="font-semibold">{card.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Mobile / iPad Swiper */}
        <div className="lg:hidden w-full mt-10  v">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
          >
            {[...leftCards, ...rightCards].map((card, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className={`flex flex-col items-center py-2 rounded-xl ${card.color} text-black shadow-xl`}
                >
                  <div className="p-3 rounded-full bg-white/20">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-center text-[12px]">
                    {card.title}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
