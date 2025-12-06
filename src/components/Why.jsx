import { CheckCircle, Eye, ScanFace, Star } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function Why() {
  return (
    <section className="relative w-full bg-gradient-to-b from-black to-gray-900 text-white py-20 md:py-28 overflow-hidden">
      
      {/* Lights & Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              Why Auraye
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Why Choose Auraye?
            </h1>

            <p className="text-sm md:text-base text-gray-300">
              Experience eyewear like never before. Our AR-powered glasses combine
              style, technology, and personalized experiences to make trying,
              choosing, and wearing glasses effortless and fun.
            </p>
          </div>

          <a
            className="mt-6 md:mt-0 bg-white text-black py-3 px-7 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition"
            href="#"
          >
            Try Now
          </a>
        </header>

        {/* Cards */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Eye,
              title: "Virtual Try-On",
              desc: "Instantly try any frame in AR. See how it fits your face in real time.",
              btn: "Try Now",
            },
            {
              icon: Star,
              title: "Personalized Recommendations",
              desc: "Smart suggestions based on your style, face shape, and AR analysis.",
              btn: "Discover",
            },
            {
              icon: ScanFace,
              title: "3D Frame Viewer",
              desc: "Rotate, zoom, and explore frames in full 3D before buying.",
              btn: "Explore",
            },
            {
              icon: CheckCircle,
              title: "Lens & Fit Guidance",
              desc: "Accurate lens recommendations and AR-based fit optimization.",
              btn: "Learn More",
            },
          ].map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col hover:bg-white/10 transition"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-black shadow-lg group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                <p className="text-gray-300 text-sm mb-8 flex-grow">{item.desc}</p>

                <a className="bg-white text-black text-center py-3 rounded-full font-semibold hover:bg-gray-200 transition shadow-lg cursor-pointer">
                  {item.btn}
                </a>
              </motion.div>
            );
          })}
        </main>
      </div>
    </section>
  );
}
