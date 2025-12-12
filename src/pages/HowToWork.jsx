// src/pages/HowToWork.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanFace,
  Camera,
  Cpu,
  Shield,
  Zap,
  Layers,
  Sparkles,
  Eye,
  ChevronDown,
  ArrowRight,
  Lock,
  Globe,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Pill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/85">
      <Icon className="h-4 w-4 text-white/80" />
      <span>{text}</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function AccordionItem({ title, icon: Icon, children, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/40">
            <Icon className="h-5 w-5 text-white/85" />
          </div>
          <div className="text-sm font-semibold text-white">{title}</div>
        </div>
        <ChevronDown
          className={[
            "h-5 w-5 text-white/70 transition-transform",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm leading-relaxed text-white/75">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Step({ index, title, icon: Icon, children }) {
  return (
    <div className="relative flex gap-4">
      {/* line */}
      <div className="relative flex flex-col items-center">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-white/85" />
        </div>
        <div className="mt-2 h-full w-px bg-gradient-to-b from-white/15 via-white/10 to-transparent" />
      </div>

      <div className="pb-10">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold tracking-wider text-white/60">
            STEP {index}
          </div>
          <div className="h-px w-6 bg-white/15" />
        </div>
        <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        <div className="mt-2 text-sm leading-relaxed text-white/75">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function HowToWork() {
  const [openAcc, setOpenAcc] = useState("privacy");

  const accordions = useMemo(
    () => [
      {
        key: "privacy",
        title: "Privacy-first by design",
        icon: Lock,
        content: (
          <>
            A modern AR try-on can process frames directly in the browser so your
            camera stream doesn’t need to be uploaded. Photos/recordings are only
            created if you explicitly choose to capture or share.
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/70">
              Tip: Always show a clear permission prompt, and offer a “Try with
              demo video” fallback for users who deny camera access.
            </div>
          </>
        ),
      },
      {
        key: "performance",
        title: "How it stays smooth in real time",
        icon: Zap,
        content: (
          <>
            Real-time AR is a balancing act between accuracy and speed. Typical
            optimizations include reducing the model input size, running face
            tracking at a lower FPS than rendering, and smoothing landmarks to
            remove jitter.
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/75">
              <li>
                Track at ~15–30 FPS, render at 60 FPS (decoupled loops).
              </li>
              <li>
                Use temporal smoothing (EMA/Kalman-like) to stabilize glasses.
              </li>
              <li>
                Prefer GPU paths (WebGL) and lightweight shaders when possible.
              </li>
            </ul>
          </>
        ),
      },
      {
        key: "accuracy",
        title: "How alignment looks realistic",
        icon: Eye,
        content: (
          <>
            The glasses aren’t “stuck” to the screen. They’re anchored to face
            landmarks (eyes, nose bridge, temples), then rotated and scaled based
            on head pose. Depth cues can be improved with simple occlusion masks
            (so frames appear behind the nose when needed).
          </>
        ),
      },
      {
        key: "compat",
        title: "Browser & device compatibility",
        icon: Globe,
        content: (
          <>
            Most web AR try-ons rely on WebRTC (camera), WebGL (rendering), and
            a face-tracking model (often via JS + WASM). Good experiences include
            graceful fallbacks: static preview, manual fit controls, or guided
            calibration for older devices.
          </>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.05),transparent_45%),radial-gradient(circle_at_40%_90%,rgba(255,255,255,0.04),transparent_50%)]" />
      </div>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        {/* HERO */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Pill icon={Sparkles} text="Web AR Try-On" />
              <Pill icon={ScanFace} text="Face Tracking" />
              <Pill icon={Layers} text="3D Rendering" />
              <Pill icon={Shield} text="Privacy-minded" />
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              How AR Try-On Works
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Augmented Reality overlays a 3D glasses model on your face in real
              time. Under the hood, it combines camera access, face landmark
              detection, head-pose estimation, and GPU rendering—so the frames
              move naturally as you move.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/try"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white text-black px-5 py-3 text-sm font-semibold transition hover:bg-white/90"
              >
                Try AR Now <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
              >
                Learn the Steps <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            {/* quick stats */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/40">
                    <Camera className="h-5 w-5 text-white/85" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Live Camera</div>
                    <div className="text-xs text-white/60">
                      WebRTC / getUserMedia
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/40">
                    <Cpu className="h-5 w-5 text-white/85" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Face Landmarks</div>
                    <div className="text-xs text-white/60">
                      CV model (JS/WASM)
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/40">
                    <Layers className="h-5 w-5 text-white/85" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">3D Overlay</div>
                    <div className="text-xs text-white/60">
                      WebGL / Three.js style
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* STEPS */}
        <section id="steps" className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The pipeline (from camera to perfect fit)
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Here’s the typical flow used by modern web-based AR try-on systems.
              The exact implementation can vary, but the core steps are usually
              the same.
            </p>

            <div className="mt-7">
              <Step index="01" title="Open the camera stream" icon={Camera}>
                The browser asks for permission, then provides frames through{" "}
                <span className="text-white">WebRTC</span>. Each frame becomes the
                input for tracking and rendering.
              </Step>

              <Step index="02" title="Detect face landmarks" icon={ScanFace}>
                A computer vision model estimates key points (eyes, nose bridge,
                face contour). These landmarks are updated every frame to follow
                your movements.
              </Step>

              <Step index="03" title="Estimate head pose" icon={Eye}>
                From landmark geometry, the system infers rotation/translation
                (yaw, pitch, roll). This is what makes the glasses rotate naturally
                when you turn your head.
              </Step>

              <Step index="04" title="Fit the 3D model" icon={Layers}>
                The glasses model is scaled using measured landmark distances
                (e.g., pupil-to-pupil) and positioned using anchor points (nose
                bridge + temples).
              </Step>

              <Step index="05" title="Render with the GPU" icon={Zap}>
                A WebGL renderer draws the 3D model on top of the camera frame.
                Simple shading + anti-aliasing helps the frame look crisp and
                realistic.
              </Step>

              <Step index="06" title="Smooth, stabilize, and refine" icon={Cpu}>
                Filters reduce jitter and micro-shakes. Optional extras include
                occlusion masks, auto-exposure adjustments, and manual fine-tune
                controls for comfort.
              </Step>
            </div>
          </motion.div>

          {/* UNDER THE HOOD */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold">Under the hood</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                AR try-on is basically a real-time loop:
                <span className="text-white">
                  {" "}
                  capture → track → transform → render → repeat
                </span>
                .
                The magic is keeping it accurate, stable, and fast—especially on
                mobile.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
                      <Cpu className="h-5 w-5 text-white/85" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Computer Vision</div>
                      <div className="text-xs text-white/60">
                        Face mesh / landmarks / pose estimation
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/70">
                    Detecting facial points is the “tracking” part. Accuracy here
                    decides whether the glasses feel truly attached to your face.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
                      <Layers className="h-5 w-5 text-white/85" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">3D Rendering</div>
                      <div className="text-xs text-white/60">
                        WebGL pipeline + lighting + materials
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/70">
                    Rendering draws the 3D model with transforms from the tracker.
                    Even small tweaks—like smoothing and anti-aliasing—make a huge
                    difference in perceived quality.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
                      <Shield className="h-5 w-5 text-white/85" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Safety & Trust</div>
                      <div className="text-xs text-white/60">
                        Permissions, transparency, user control
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/70">
                    Great AR UX is clear: what you access (camera), what you store
                    (nothing unless you choose), and how users can opt out anytime.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-6 grid gap-4">
              <h3 className="text-xl font-semibold">Common technologies used</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Camera, title: "WebRTC", desc: "Access camera frames securely." },
                  { icon: ScanFace, title: "Face Mesh", desc: "Landmarks for eyes, nose, contour." },
                  { icon: Cpu, title: "WASM / JS ML", desc: "Fast model inference in browser." },
                  { icon: Layers, title: "WebGL", desc: "GPU rendering for smooth overlays." },
                  { icon: Zap, title: "requestAnimationFrame", desc: "Stable real-time render loop." },
                  { icon: Shield, title: "Permissions UX", desc: "Clear consent and safe defaults." },
                ].map((t) => (
                  <div
                    key={t.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/40">
                        <t.icon className="h-5 w-5 text-white/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{t.title}</div>
                        <div className="text-xs text-white/60">{t.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                <span className="text-white font-semibold">Note:</span> Different AR
                systems choose different libraries/models depending on device targets,
                accuracy needs, and performance goals.
              </div>
            </div>
          </motion.div>
        </section>

        {/* ACCORDIONS */}
        <section className="mt-14">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                What makes it feel “real”
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                Realism is more than just tracking. It’s stability, alignment,
                lighting, and giving users simple controls when auto-fit needs a
                tiny nudge.
              </p>

              <div className="mt-6 space-y-3">
                {accordions.map((a) => (
                  <AccordionItem
                    key={a.key}
                    title={a.title}
                    icon={a.icon}
                    open={openAcc === a.key}
                    onToggle={() => setOpenAcc((prev) => (prev === a.key ? "" : a.key))}
                  >
                    {a.content}
                  </AccordionItem>
                ))}
              </div>
            </div>

            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold">Quick AR checklist</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                If you’re building an AR try-on experience, these are the make-or-break
                details users notice instantly.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Clear camera permission screen + fallback option",
                  "Stable glasses (smoothing + less jitter)",
                  "Correct scale (pupil distance / face width)",
                  "Natural rotation (yaw/pitch/roll aligned)",
                  "Good lighting / contrast for the model",
                  "Manual fit controls (tiny adjust slider)",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-black/40">
                      <Sparkles className="h-4 w-4 text-white/85" />
                    </div>
                    <div className="text-sm text-white/75">{item}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/try"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open AR <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
                >
                  Browse Frames
                </Link>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  FAQ
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                  Common questions people ask about AR glasses try-on.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {[
                {
                  q: "Does AR try-on work without an app?",
                  a: "Yes—many experiences run directly in the browser using WebRTC for camera access and WebGL for rendering.",
                },
                {
                  q: "Why does it sometimes feel shaky?",
                  a: "Landmark detection can jitter on low light or low-end devices. Smoothing filters and better lighting usually fix it.",
                },
                {
                  q: "How does it size the glasses correctly?",
                  a: "It estimates scale using landmark distances (like eye distance / face width). Some systems add a calibration step for extra accuracy.",
                },
                {
                  q: "Is it safe to allow camera access?",
                  a: "Camera access is permission-based. A privacy-first approach processes frames locally and avoids uploading unless you choose to share.",
                },
              ].map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="text-sm font-semibold text-white">{f.q}</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/70">
                    {f.a}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FOOTER CTA */}
        <section className="mt-14">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <Card className="p-6 sm:p-10">
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Ready to see it live?
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                    Open the AR experience, choose a frame, and watch it lock onto
                    your face in real time—smooth, sharp, and built with a clean
                    black & white aesthetic.
                  </p>
                </div>
                <Link
                  to="/try"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Start AR Try-On <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
