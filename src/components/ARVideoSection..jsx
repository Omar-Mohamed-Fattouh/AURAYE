import { motion } from "framer-motion";

export default function ARVideoSection() {
  return (
    <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src="/videos/ar-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-75"
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Experience <span className="text-sky-400">AR Try-On</span> in Action
        </h2>
        <p className="text-slate-200 max-w-2xl mb-8 text-lg md:text-xl drop-shadow-md">
          Watch how our Augmented Reality feature lets you try glasses instantly — right from your camera, no app needed.
        </p>
        <motion.a
          href="/tryon"
          className="inline-block px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-full shadow-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Now
        </motion.a>
      </motion.div>
    </section>
  );
}
