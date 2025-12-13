import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Search, Home, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;

const homePage = q.toLowerCase() === "home" || q.toLowerCase() === "homepage";
    if (homePage) {
      navigate("/");
      return;
    }
    navigate(`/${encodeURIComponent(q)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:32px_32px]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center"
        >
          {/* Left: main message */}
          <section className="flex-1 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200">
              <Compass className="h-3.5 w-3.5" />
              Page not found
            </div>

            {/* 404 + title */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="text-7xl font-black leading-none text-white select-none sm:text-8xl lg:text-9xl"
                >
                  404
                </motion.span>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                  AURAYE EXPERIENCE
                </p>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl">
                The page you’re looking for is out of view.
              </h1>

              <p className="max-w-xl text-sm text-slate-400 sm:text-base">
                The link might be broken, or the page may have been moved. Use
                the shortcuts below to get back to a clear path.
              </p>
            </div>

            {/* Main actions – زودنا أزرار زيادة */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap sm:gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-50 px-6 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:bg-white"
              >
                <Home className="h-4 w-4" />
                Back to homepage
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/0 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/5"
              >
                <HelpCircle className="h-4 w-4" />
                Contact support
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/0 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Browse frames
              </Link>

              <Link
                to="/tryon"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/0 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Launch AR try-on
              </Link>
            </div>

            {/* Mini links */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <Link
                to="/products"
                className="hover:text-slate-100 hover:underline underline-offset-4"
              >
                Browse all products
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                to="/tryon"
                className="hover:text-slate-100 hover:underline underline-offset-4"
              >
                Launch AR try-on
              </Link>
              <span className="text-slate-600">•</span>
              <Link
                to="/faq"
                className="hover:text-slate-100 hover:underline underline-offset-4"
              >
                Visit Help Center
              </Link>
            </div>
          </section>

          {/* Right: card / “radar” */}
          <section className="flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="relative mx-auto max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-slate-900/60 to-black/80 p-6 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur-xl"
            >
              {/* Corner accent */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-3xl" />

              {/* Top bar */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Signal lost</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500">
                  #AURAYE_404
                </p>
              </div>

              {/* Radar / map style */}
              <div className="relative mb-5 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-black via-slate-900 to-slate-950 p-5">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0,_transparent_55%)]" />

                {/* Rings */}
                <div className="relative flex items-center justify-center">
                  <div className="h-40 w-40 rounded-full border border-white/10" />
                  <div className="absolute h-28 w-28 rounded-full border border-white/15" />
                  <div className="absolute h-16 w-16 rounded-full border border-white/25" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute h-44 w-44 rounded-full border border-white/10 border-dashed"
                  />

                  {/* Blip */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)]"
                  />
                </div>

                {/* Bottom labels */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-slate-300">
                  <div className="space-y-1">
                    <p className="text-slate-500">Status</p>
                    <p className="font-mono text-xs text-white">
                      404_NOT_FOUND
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Path</p>
                    <p className="truncate font-mono text-xs text-white/90">
                      /unknown/route
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-slate-500">Next step</p>
                    <p className="font-mono text-xs text-white/90">
                      RETURN_HOME
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick search – شغالة دلوقتي */}
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-200">
                  <Search className="h-4 w-4 text-slate-300" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder='Search for “AR try-on”, “frames”, ...'
                    className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-50 hover:bg-white/20 transition"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search site
                </button>
              </div>

              {/* Bottom helper row */}
              <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Use the buttons above to navigate back safely.</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 hover:bg-white/5 transition"
                >
                  Go to previous page
                </button>
              </div>
            </motion.div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
