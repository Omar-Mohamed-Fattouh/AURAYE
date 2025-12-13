// src/components/AurayeLoader.jsx
import React from "react";

export default function AurayeLoader({
  label = "Loading",
  subtitle = "AURAYE",
  fullScreen = true,
}) {
  const Wrapper = fullScreen ? "div" : React.Fragment;
  const wrapperProps = fullScreen
    ? { className: "fixed inset-0 z-[9999] grid place-items-center bg-black" }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="relative">
        {/* background glow (monochrome) */}
        <div className="pointer-events-none absolute -inset-10 rounded-[40px] blur-2xl opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.08),transparent_55%)]" />

        {/* card */}
        <div className="relative w-[320px] sm:w-[360px] rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          {/* top highlight */}
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          {/* ring system */}
          <div className="mx-auto grid place-items-center">
            <div className="relative h-24 w-24">
              {/* outer orbit */}
              <div className="absolute inset-0 rounded-full border border-white/10" />

              {/* rotating sweep */}
              <div className="absolute inset-0 rounded-full auraye-spin [mask-image:radial-gradient(circle,transparent_48%,black_52%)] bg-[conic-gradient(from_90deg,transparent,rgba(255,255,255,0.9),transparent_65%)]" />

              {/* inner ring */}
              <div className="absolute inset-[10px] rounded-full border border-white/10 bg-white/[0.02]" />

              {/* center "A" monogram */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative grid place-items-center">
                  <div className="absolute -inset-3 rounded-full blur-xl opacity-30 bg-white" />
                  <span className="relative select-none text-[28px] font-semibold tracking-[0.18em] text-white">
                    A
                  </span>
                </div>
              </div>

              {/* micro dots orbit */}
              <div className="absolute inset-0 auraye-orbit">
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                <span className="absolute left-1/2 bottom-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/30" />
              </div>

              {/* subtle glitch lines */}
              <div className="absolute inset-0 rounded-full auraye-scan opacity-30" />
            </div>
          </div>

          {/* text */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm font-medium tracking-[0.28em] text-white/80">
                {subtitle}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-sm tracking-[0.18em] text-white/60">
                {label}
              </span>
            </div>

            {/* shimmer bar */}
            <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[45%] auraye-shimmer rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/45">
              Please wait… we’re calibrating your AR experience.
            </p>
          </div>
        </div>
      </div>

      {/* styles */}
      <style>{`
        .auraye-spin{
          animation: aurayeSpin 1.15s linear infinite;
        }
        @keyframes aurayeSpin{
          to{ transform: rotate(360deg); }
        }

        .auraye-shimmer{
          animation: aurayeShimmer 0.95s ease-in-out infinite;
        }
        @keyframes aurayeShimmer{
          0%{ transform: translateX(-65%); opacity: 0.25; }
          45%{ opacity: 1; }
          100%{ transform: translateX(165%); opacity: 0.25; }
        }

        .auraye-orbit{
          animation: aurayeOrbit 1.6s cubic-bezier(.5,.1,.2,1) infinite;
        }
        @keyframes aurayeOrbit{
          0%{ transform: rotate(0deg); opacity: .9; }
          70%{ opacity: .55; }
          100%{ transform: rotate(360deg); opacity: .9; }
        }

        .auraye-scan{
          background:
            linear-gradient(transparent 48%, rgba(255,255,255,0.22) 50%, transparent 52%),
            linear-gradient(transparent 62%, rgba(255,255,255,0.10) 63%, transparent 64%);
          animation: aurayeScan 1.05s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        @keyframes aurayeScan{
          0%{ transform: translateY(-2px); opacity: .15; }
          50%{ transform: translateY(2px); opacity: .35; }
          100%{ transform: translateY(-2px); opacity: .15; }
        }
      `}</style>
    </Wrapper>
  );
}
