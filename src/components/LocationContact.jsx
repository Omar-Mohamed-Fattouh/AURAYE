import React from "react";
import { MapPin, Clock, Sparkles } from "lucide-react";

export default function MapSection() {
  return (
    <section className="relative overflow-hidden bg-black text-white py-16 px-4 sm:py-20">
      {/* subtle grayscale background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-white/10 blur-[90px]" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-white/10 blur-[90px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              <Sparkles className="h-3 w-3 text-white" />
            </span>
            Visit us
          </p>

          <h2 className="mt-3 text-[30px] sm:text-[38px] font-semibold leading-tight tracking-[-0.03em]">
            Our showroom & office
          </h2>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-zinc-400">
            Try your favorite frames in person, pick up your order, or just say hi.
            We're happy to welcome you in Ismailia.
          </p>

          {/* Info badges */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-700 px-4 py-2 text-xs text-zinc-300 backdrop-blur">
              <MapPin className="h-3.5 w-3.5" />
              Ismailia, Egypt
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/60 border border-zinc-700 px-4 py-2 text-xs text-zinc-300 backdrop-blur">
              <Clock className="h-3.5 w-3.5" />
              Sat–Thu · 10 AM – 6 PM
            </div>
          </div>
        </header>

        {/* Map Box */}
        <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.45)] overflow-hidden">
          {/* grayscale border hover effect */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-px rounded-[22px] bg-gradient-to-br from-white/10 via-transparent to-white/20" />
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.550364141182!2d31.23571191506563!3d30.044419981878973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1697040000000"
            className="w-full h-[420px] border-0 grayscale hover:grayscale-0 transition duration-300"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
