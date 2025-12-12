import { motion } from "framer-motion";

export default function ARVideoSection() {
  return (
    <section className="relative w-full h-screen md:h-[90vh] overflow-hidden bg-black">
      {/* فيديو الخلفية */}
      <video
        src="/videos/ar-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* أوفرلاي أسود كامل (من فوق لتحت) */}
      <div className="absolute inset-0 bg-black/85 z-10"></div>

      {/* محتوى النصوص */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 sm:px-8 md:px-12">
        <motion.h2
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight"
        >
          Experience AR Try-On
        </motion.h2>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-lg md:max-w-2xl mb-8 leading-relaxed"
        >
          Try glasses instantly with our Augmented Reality feature — straight from your camera, no app required.
        </motion.p>

        <motion.a
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          href="/try"
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 md:px-10 md:py-4 text-sm md:text-base font-semibold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Try Now"
        >
          {/* زر أبيض بخط أسود */}
          <span className="bg-white text-black rounded-full px-4 py-1.5">Try Now</span>
        </motion.a>
      </div>

      {/* subtle bottom gradient (black to black transparent edge) — still black/white palette */}
      <div className="absolute left-0 right-0 bottom-0 h-24 pointer-events-none z-10 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
    </section>
  );
}
