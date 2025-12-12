// src/components/HeroSection.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, ScanFace, ArrowRight } from "lucide-react";
import { getProducts } from "../api/productsApi";

export default function HeroSection({
  products = [],
  backgroundImage = "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  placeholder = "Search for eyewear, styles, or brands...",
  // tags: if you pass custom tags we use them, otherwise we build from data
  tags,
  onSelect,
}) {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  // internal products source (from props OR API)
  const [sourceProducts, setSourceProducts] = useState(products);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  /* -------------------- LOAD PRODUCTS -------------------- */

  useEffect(() => {
    if (products && products.length > 0) {
      setSourceProducts(products);
    }
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProducts(true);

        if (products && products.length > 0) {
          setSourceProducts(products);
          return;
        }

        const data = await getProducts();
        setSourceProducts(data || []);
      } catch (err) {
        console.error("Hero search: failed to load products", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, []); // once only

  /* -------------------- DEBOUNCE -------------------- */

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchValue.trim()), 150);
    return () => clearTimeout(t);
  }, [searchValue]);

  /* -------------------- DYNAMIC TAGS -------------------- */

  const effectiveTags = useMemo(() => {
    if (tags && tags.length > 0) return tags;

    const values = [];

    sourceProducts.forEach((p) => {
      if (p.category) values.push(p.category);
      if (p.shape) values.push(p.shape);
      if (p.gender) values.push(p.gender);
    });

    return [...new Set(values)].slice(0, 8);
  }, [tags, sourceProducts]);

  /* -------------------- FILTER PRODUCTS -------------------- */

  const filtered = useMemo(() => {
    if (!debounced) return [];
    const q = debounced.toLowerCase();

    return sourceProducts
      .filter((p) => {
        const name = p.name || p.title || "";
        const desc = p.description || "";
        const category =
          typeof p.category === "string" ? p.category : p.category?.name || "";
        const shape = p.shape || "";
        const gender = p.gender || "";

        return (
          name.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          category.toLowerCase().includes(q) ||
          shape.toLowerCase().includes(q) ||
          gender.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [debounced, sourceProducts]);

  /* -------------------- IMAGE HELPER -------------------- */

  const getThumb = (item) => {
    if (item.images?.length) return item.images[0].url;
    if (item.productImages?.length) return item.productImages[0].imgUrl;

    return (
      item.defaultImgUrl ||
      item.image_url ||
      item.imageUrl ||
      item.thumbnail ||
      ""
    );
  };

  /* -------------------- CLOSE ON OUTSIDE CLICK -------------------- */

  useEffect(() => {
    const handler = (e) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target) &&
        !(inputRef.current && inputRef.current.contains(e.target))
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* -------------------- SELECT PRODUCT -------------------- */

  const handleSelect = (item) => {
    setSearchValue("");
    setOpen(false);

    if (onSelect) return onSelect(item);

    const id = item.id ?? item.productId;
    if (id != null) {
      navigate(`/products/${id}`, { state: { product: item } });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!debounced) return;

    // لو في نتيجة استخدم أول واحدة وودّي عليها مباشرة
    if (filtered.length > 0) {
      handleSelect(filtered[0]);
    } else {
      setOpen(true);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <motion.section
      className="relative z-20 w-full min-h-screen lg:h-screen flex items-center pt-24 md:pt-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* BACKGROUND IMAGE + GRADIENTS */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Auraye eyewear hero"
          className="w-full h-full object-cover object-[60%_center] lg:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" />

        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-40 -left-16 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14 flex flex-col lg:flex-row items-center lg:items-start gap-10">
          {/* LEFT: text + search */}
          <div className="w-full lg:max-w-xl xl:max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-3 sm:px-4 py-1 text-[11px] uppercase tracking-[0.25em] text-white/70 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span>Next-Gen Eyewear Experience</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-3">
              Find Your{" "}
              Perfect Pair
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-200/90 max-w-xl mb-6">
              Search across premium frames and try them instantly with{" "}
              <span className="font-semibold text-white">live AR try-on</span>.
              Sharp, realistic, and tailored to your face in seconds.
            </p>

            <div className="flex flex-wrap gap-3 mb-6 text-[11px] text-gray-200">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1">
                <ScanFace className="w-3.5 h-3.5 text-white" />
                <span>Real-time AR fitting</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Curated premium styles</span>
              </div>
            </div>

            {/* SEARCH */}
            <form
              onSubmit={handleSubmit}
              className="relative w-full max-w-xl"
              autoComplete="off"
            >
              <div className="relative flex items-center rounded-full bg-white/5 border border-white/15 px-3 sm:px-4 pr-2 py-2.5 backdrop-blur-xl shadow-xl shadow-black/40">
                <Search className="w-5 h-5 text-white/60 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={
                    loadingProducts ? "Loading products..." : placeholder
                  }
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (!open) setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 outline-none border-none"
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-full bg-white text-black text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 hover:bg-gray-100 transition-colors"
                  disabled={loadingProducts}
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* DROPDOWN RESULTS (جوا الهيرو نفسه) */}
              {open && debounced && (
                <div
                  ref={resultsRef}
                  className="
                    absolute left-0 right-0 mt-3 rounded-2xl bg-black/95 
                    border border-white/10 shadow-2xl backdrop-blur-2xl 
                    max-h-80 overflow-y-auto z-[40] p-1
                  "
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "white transparent",
                  }}
                >
                  {loadingProducts ? (
                    <div className="px-4 py-4 text-sm text-white/60">
                      Loading products...
                    </div>
                  ) : filtered.length > 0 ? (
                    <>
                      <div className="px-4 pt-3 pb-2 text-[11px] uppercase tracking-[0.2em] text-white/40 flex items-center justify-between">
                        <span>Products</span>
                        <span className="text-white/30">
                          {filtered.length} results
                        </span>
                      </div>

                      {filtered.map((item) => (
                        <button
                          key={item.id ?? item.productId}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg:white/5 hover:bg-white/5 transition-colors"
                        >
                          {getThumb(item) ? (
                            <img
                              src={getThumb(item)}
                              alt={item.name || item.title}
                              className="w-10 h-10 rounded-md object-cover border border-white/10 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-[10px] text-white/60 flex-shrink-0">
                              AR
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-white truncate">
                              {item.name || item.title}
                            </p>
                            {(item.category || item.shape) && (
                              <p className="text-[11px] text-white/45 truncate">
                                {typeof item.category === "string"
                                  ? item.category
                                  : item.category?.name}
                                {item.shape ? ` • ${item.shape}` : ""}
                              </p>
                            )}
                          </div>
                          {item.price != null && (
                            <span className="text-xs text-white/70 whitespace-nowrap">
                              {item.price} EGP
                            </span>
                          )}
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-4 text-sm text-white/60">
                      No products found. Try another style or keyword.
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* TAGS */}
            {effectiveTags.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-xs sm:text-sm text-white/70">
                  Frequently searched:
                </span>
                {effectiveTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchValue(tag);
                      inputRef.current?.focus();
                      setOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs sm:text-sm text:white text-white hover:bg-white/15 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
