import { useState } from "react";
import { Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const aboutAccordionContent = [
  {
    id: 1,
    title: "AR Virtual Try-On",
    content:
      "Instantly try on any pair of glasses using advanced AR technology and see how they look on your face in real time — no store visit needed.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
  {
    id: 2,
    title: "Smart Frame Recommendations",
    content:
      "Get personalized frame suggestions based on your face shape, style preferences, and AR analysis to match both your lifestyle and look.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
  {
    id: 3,
    title: "3D Frame Viewer",
    content:
      "Explore glasses in full 3D. Rotate, zoom, and inspect every detail and color before committing to your next pair.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
  {
    id: 4,
    title: "Lens & Fit Guidance",
    content:
      "Receive clear guidance on lens types, coatings, and fit using AR-based measurements so your glasses feel as good as they look.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
];

export default function AboutVision() {
  const [activeId, setActiveId] = useState(1);

  const handleToggleAccordion = (id) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <section className="relative py-20 bg-black text-white overflow-hidden">
      {/* subtle gradient / glow background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#22d3ee33,_transparent_55%),radial-gradient(circle_at_bottom,_#4f46e533,_transparent_55%)] opacity-70" />

      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 lg:px-10">
        {/* LEFT SIDE */}
        <LeftTextSide />

        {/* RIGHT SIDE – TIMELINE / ACCORDION */}
        <div className="relative md:pl-10">
          {/* vertical line */}
          <VerticalLineAndGlowingDot activeId={activeId} />

          <div className="space-y-2">
            {aboutAccordionContent.map((item) => (
              <AccordionItem
                key={item.id}
                service={item}
                activeId={activeId}
                onToggleAccordion={handleToggleAccordion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeftTextSide() {
  return (
    <div className="space-y-8 max-w-xl">
      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Eye className="w-5 h-5 text-cyan-300" />
        </motion.div>
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
          Welcome to Auraye
        </span>
      </div>

      <motion.h3
        className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        A new way to{" "}
        <span className="bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          try on glasses
        </span>{" "}
        with AR.
      </motion.h3>

      <motion.p
        className="text-sm md:text-base text-white/70 leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Auraye blends immersive AR technology with modern eyewear design so you
        can explore, compare, and fall in love with your next pair of glasses —
        all from your screen.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Link
          to="/tryon"
          className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-semibold px-6 py-2.5 hover:bg-white/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Start AR Try-On
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 text-sm font-medium px-5 py-2.5 text-white/80 hover:border-white hover:text-white transition-colors"
        >
          Learn how it works
        </Link>
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-4 text-xs text-white/50"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
          Real-time face tracking
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          3D frame previews
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Lens & fit guidance
        </span>
      </motion.div>
    </div>
  );
}

function AccordionItem({ service: { id, title, content, image }, activeId, onToggleAccordion }) {
  const isOpen = activeId === id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative pl-6"
    >
      {/* clickable title row */}
      <button
        onClick={() => onToggleAccordion(id)}
        className={`group w-full text-left py-4 pr-4 flex items-center justify-between gap-3
        transition-colors duration-300 ${
          isOpen ? "text-white" : "text-white/60"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/40">{String(id).padStart(2, "0")}</span>
          <span className="text-base md:text-lg font-semibold">{title}</span>
        </div>

        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border border-white/25 text-xs transition-transform duration-300 ${
            isOpen ? "bg-white text-black rotate-90" : "bg-white/5 text-white"
          }`}
        >
          ▸
        </span>
      </button>

      {/* content */}
      <div
        className={`grid transition-all duration-400 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 mb-4 flex flex-col md:flex-row gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3">
            {/* image */}
            <div className="relative w-full md:w-40 h-28 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent pointer-events-none" />
            </div>

            {/* text & CTA */}
            <div className="flex-1 flex flex-col justify-between gap-2">
              <p className="text-sm text-white/70 leading-relaxed">{content}</p>
              <Link
                to="/tryon"
                className="inline-flex w-max items-center gap-2 text-xs font-medium text-cyan-300 hover:text-cyan-200"
              >
                Explore this feature
                <span className="text-[11px]">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VerticalLineAndGlowingDot({ activeId }) {
  const step = 100 / (aboutAccordionContent.length + 0.5); // smoother distribution
  const topOffset = step * activeId;

  return (
    <>
      {/* base line */}
      <span className="pointer-events-none absolute left-0 top-3 h-[calc(100%-1.5rem)] w-px bg-white/15" />

      {/* active segment */}
      <span
        className="pointer-events-none absolute left-0 top-3 w-px bg-gradient-to-b from-cyan-300 via-indigo-400 to-transparent transition-all duration-500 ease-in-out"
        style={{ height: `${topOffset}%` }}
      />

      {/* glowing dot */}
      <span
        className="pointer-events-none absolute left-[-5px] w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)] transition-all duration-500 ease-in-out"
        style={{ top: `calc(3% + ${topOffset}%)` }}
      />
    </>
  );
}
