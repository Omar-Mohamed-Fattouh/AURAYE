// src/components/Team.jsx
import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Mail, Sparkles } from "lucide-react";

const members = [
  {
    name: "Lena Carter",
    role: "Co-Founder & CEO",
    focus: "Vision, partnerships, and brand strategy.",
    avatar:
      "https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Noah Williams",
    role: "Chief Technology Officer",
    focus: "AR engine, infrastructure, and product performance.",
    avatar:
      "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Amira Hassan",
    role: "Head of Product",
    focus: "Customer journeys, feature roadmap, and UX decisions.",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Daniel Green",
    role: "Lead Computer Vision Engineer",
    focus: "Face tracking, 3D fitting, and experimentation.",
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Sara Youssef",
    role: "Head of Experience Design",
    focus: "Visual language, micro-interactions, and branding.",
    avatar:
      "https://images.pexels.com/photos/1181742/pexels-photo-1181742.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Oliver Chen",
    role: "Growth & Analytics Lead",
    focus: "Data, retention, and scalable experimentation.",
    avatar:
      "https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const container = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.07,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Team() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-16 sm:py-20 px-4">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-white/20 blur-[90px]" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-sky-500/20 blur-[90px]" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={container}
      >
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                <Sparkles className="h-3 w-3 text-emerald-400" />
              </span>
              The people behind Auraye
            </p>
            <h2 className="text-[32px] sm:text-[38px] md:text-[42px] font-semibold leading-tight tracking-[-0.04em]">
              A small, senior team
              <br />
              obsessed with the details.
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-400">
              Every interaction, frame, and pixel you see is crafted by this
              group of engineers, designers, and product minds working closely
              together.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-300 flex items-center gap-2 backdrop-blur">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/40 opacity-60" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500/80" />
              </span>
              Working across Cairo, Dubai & Berlin
            </div>
            <button className="rounded-full bg-white text-black text-xs font-semibold px-5 py-2 hover:bg-zinc-200 transition-colors">
              Meet the founders
            </button>
          </div>
        </header>

        {/* Grid */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {members.map((member, idx) => (
            <motion.article
              key={member.name}
              variants={cardVariant}
              className="group relative rounded-3xl border border-zinc-800/80 bg-zinc-950/70 px-5 py-6 sm:px-6 sm:py-7 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.45)] overflow-hidden"
            >
              {/* gradient border on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-px rounded-[22px] bg-gradient-to-br from-emerald-500/15 via-zinc-800/0 to-sky-500/20" />
              </div>

              <div className="relative flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border border-zinc-700/70 bg-zinc-900/80">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 text-[10px] font-semibold text-black px-2 py-0.5 shadow-lg">
                    Core
                  </span>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 mt-1">
                    {member.role}
                  </p>
                </div>
              </div>

              <p className="relative text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
                {member.focus}
              </p>

              {/* footer */}
              <div className="relative flex items-center justify-between text-[11px] sm:text-xs text-zinc-400">
                <div className="inline-flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <span className="h-6 w-6 rounded-full bg-white/90 border border-emerald-400/40" />
                    <span className="h-6 w-6 rounded-full bg-sky-500/20 border border-sky-400/40" />
                  </div>
                  <span>Available for quick product reviews</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 hover:bg-white hover:text-black transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 hover:bg-white hover:text-black transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
