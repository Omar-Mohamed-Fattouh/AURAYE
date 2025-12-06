import React from "react";
import { Link } from "react-router-dom";
import { Eye, Sun, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const leftCards = [
  {
    icon: Eye,
    title: "AR Virtual Try-On",
    desc: "See frames on your face in real time with ultra-precise tracking.",
  },
  {
    icon: Sun,
    title: "Smart Sunglasses",
    desc: "Stylish designs with high UV protection for everyday use.",
  },
];

const rightCards = [
  {
    icon: Heart,
    title: "Loved by Customers",
    desc: "Hundreds of 5-star reviews from happy Auraye users.",
  },
  {
    icon: Globe,
    title: "Global Access",
    desc: "Experience Auraye anywhere with worldwide availability.",
  },
];

const allCards = [...leftCards, ...rightCards];

const floatVariant = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: [0, -10, 0],
    transition: {
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

export default function AboutHero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-black to-slate-900 text-white overflow-hidden py-16 md:py-24">
      {/* Glow background & grid */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 -left-20 h-72 w-72 rounded-full bg-emerald-500 blur-3xl" />
        <div className="absolute -bottom-40 -right-10 h-72 w-72 rounded-full bg-cyan-500 blur-3xl" />
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#ffffff22_0,_transparent_55%),linear-gradient(to_bottom,_#02061755,_#020617)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top text */}
        <div className="text-center mb-10 md:mb-16">
          <p className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] text-emerald-300/80 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Auraye Supreme Eyewear
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Elevate Your Vision
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-cyan-300">
              with Smart AR Try-On
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300">
            Instantly try any frame, explore 3D details, and find your perfect
            match without leaving home. Auraye makes choosing eyewear feel like
            pure magic, not a chore.
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Left side: feature chips + text (desktop) */}
          <div className="hidden lg:flex flex-col gap-6 flex-1">
            {leftCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={floatVariant(idx * 0.4)}
                  initial="initial"
                  animate="animate"
                  className="group flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-4 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,23,42,0.8)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-black shadow-lg group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center: hero image + overlay card */}
          <div className="relative flex-1 max-w-xl w-full">
            {/* circular glow behind image */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 md:h-96 md:w-96 rounded-full bg-emerald-400/10 blur-3xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-xl"
            >
              <img
                src="/VTOOO.jpg"
                alt="Auraye AR Virtual Try-On"
                className="w-full h-[380px] sm:h-[440px] md:h-[520px] object-cover object-center"
              />

              {/* overlay bottom panel */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300 mb-1">
                      Live AR Preview
                    </p>
                    <p className="text-sm sm:text-base text-slate-100">
                      Move your head, change frames, and see every angle in
                      real time.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/tryon"
                      className="inline-flex items-center justify-center rounded-full bg-white text-black text-[8px] font-semibold px-4 py-2 shadow-lg hover:bg-slate-100 transition-colors"
                    >
                      Start AR Try-On
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center rounded-full border border-white/40 text-[8px] font-semibold px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                      Browse Collection
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 40, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="hidden sm:flex absolute -bottom-8 -left-4 md:-left-10 bg-white text-slate-900 rounded-2xl px-4 py-3 shadow-2xl border border-slate-200 backdrop-blur-xl"
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white text-xs font-semibold">
                4K
              </div>
              <div>
                <p className="text-xs font-semibold">Ultra-clear tracking</p>
                <p className="text-[11px] text-slate-500">
                  Powered by advanced depth perception.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side: feature chips (desktop) */}
          <div className="hidden lg:flex flex-col gap-6 flex-1">
            {rightCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={floatVariant(idx * 0.5)}
                  initial="initial"
                  animate="animate"
                  className="group flex items-start gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 py-4 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,23,42,0.8)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-black shadow-lg group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / tablet feature slider */}
        <div className="lg:hidden mt-10">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={1.5}
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            loop
          >
            {allCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <SwiperSlide key={`${card.title}-${idx}`}>
                  <div className="h-full rounded-2xl bg-white/10 border border-white/15 px-4 py-4 flex items-center gap-3 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.6)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-black">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{card.title}</h3>
                      <p className="text-[11px] text-slate-200 mt-0.5">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
