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
        className="absolute inset-0 w-full h-full object-cover object-center md:object-center brightness-75"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

      {/* محتوى النصوص */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 md:px-12">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-snug"
        >
          Experience AR Try-On
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 max-w-md sm:max-w-lg md:max-w-2xl mb-8 drop-shadow-md leading-relaxed"
        >
          Try glasses instantly with our Augmented Reality feature — straight from your camera, no app required.
        </motion.p>

        <motion.a
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          href="/try"
          className="bg-white text-black font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:bg-sky-500 text-sm sm:text-base md:text-lg"
        >
          Try Now
        </motion.a>
      </div>
    </section>
  );
}
