import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSection({
  products = [],
  backgroundImage = "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  placeholder = "Search for products...",
  tags = ["Sunglasses", "Blue Light", "Reading Glasses", "Kids' Glasses"],
  onSelect,
}) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [debounced, setDebounced] = useState("");

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const [open, setOpen] = useState(false);

  /** Debounce input */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchValue), 120);
    return () => clearTimeout(t);
  }, [searchValue]);

  /** Filter products */
  const filtered = useMemo(() => {
    if (!debounced) return [];
    const q = debounced.toLowerCase();
    return products
      .filter((p) => p.name?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [debounced, products]);

  /** Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /** Select product */
  const handleSelect = (item) => {
    setSearchValue("");
    setOpen(false);
    if (onSelect) return onSelect(item);

    navigate(`/product/${item.id}`, { state: { product: item } });
  };

  return (
    <motion.section
      className="relative w-full h-screen min-h-[600px] flex flex-col justify-center overflow-hidden pt-20 md:pt-28"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* BG IMAGE */}
      <div className="absolute inset-0 -z-10">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover object-[60%_center] lg:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/35"></div>
      </div>

      {/* Text + Search */}
      <div className="relative z-10 px-6 md:px-12 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          Find Your Perfect Pair
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
          Discover Stylish Eyewear with AR Try-On
        </p>

        {/* Search */}
        <div className="relative max-w-2xl">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-full py-4 pl-5 pr-5 rounded-full bg-white/10 text-white placeholder-white/40 outline-none border border-white/20 focus:border-white/40 transition"
          />

          {/* RESULTS */}
          {open && (
            <div
              ref={resultsRef}
              className="absolute left-0 right-0 top-full mt-2 bg-black/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto z-50"
            >
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-4 p-3 text-left text-white hover:bg-white/10 transition"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <span className="truncate">{item.name}</span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-white/60">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-sm text-white/70">Frequently searched:</span>

          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchValue(tag);
                inputRef.current?.focus();
                setOpen(true);
              }}
              className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
