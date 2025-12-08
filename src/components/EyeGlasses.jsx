// src/pages/EyeGlasses.jsx
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function EyeGlasses() {
  const [eyeProducts, setEyeProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + filters
  const [searchTerm, setSearchTerm] = useState("");
  const [shapeFilter, setShapeFilter] = useState("");
  const [frameFilter, setFrameFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // mobile filters sheet
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadEyeProducts = async () => {
      try {
        const all = await getProducts();
        const filtered = (all || []).filter(
          (p) =>
            String(
              typeof p.category === "string" ? p.category : p.category?.name
            )
              .toLowerCase()
              .trim() === "eyeglasses"
        );
        setEyeProducts(filtered);
      } catch (err) {
        console.error("Failed to load eyeglasses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEyeProducts();
  }, []);

  const shapes = useMemo(() => {
    const set = new Set(
      eyeProducts
        .map((p) => p.shape)
        .filter((s) => s && String(s).trim() !== "")
    );
    return Array.from(set);
  }, [eyeProducts]);

  const frameMaterials = useMemo(() => {
    const set = new Set(
      eyeProducts
        .map((p) => p.frameMaterial)
        .filter((m) => m && String(m).trim() !== "")
    );
    return Array.from(set);
  }, [eyeProducts]);

  const genders = useMemo(() => {
    const set = new Set(
      eyeProducts
        .map((p) => p.gender)
        .filter((g) => g && String(g).trim() !== "")
    );
    return Array.from(set);
  }, [eyeProducts]);

  const filteredProducts = useMemo(() => {
    return eyeProducts.filter((p) => {
      const name = (p.name || p.title || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const nameMatch = !search || name.includes(search);

      const shapeMatch =
        !shapeFilter ||
        String(p.shape).toLowerCase() === shapeFilter.toLowerCase();

      const frameMatch =
        !frameFilter ||
        String(p.frameMaterial).toLowerCase() === frameFilter.toLowerCase();

      const genderMatch =
        !genderFilter ||
        String(p.gender).toLowerCase() === genderFilter.toLowerCase();

      return nameMatch && shapeMatch && frameMatch && genderMatch;
    });
  }, [eyeProducts, searchTerm, shapeFilter, frameFilter, genderFilter]);

  const hasActiveFilters = !!(shapeFilter || frameFilter || genderFilter);

  const clearFilters = () => {
    setShapeFilter("");
    setFrameFilter("");
    setGenderFilter("");
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-wide">
          Loading eyeglasses…
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="w-full mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-black tracking-tight">
                Eyeglasses
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-500 max-w-xl">
                Browse our eyeglasses collection for everyday comfort and style.
              </p>
            </div>

            {/* Desktop stats */}
            <div className="hidden md:flex items-center gap-4 text-xs text-gray-600">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Total eyeglasses:{" "}
                <span className="font-medium text-black">
                  {eyeProducts.length}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Showing:{" "}
                <span className="font-medium text-black">
                  {filteredProducts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search + filters button (mobile) */}
          <div className="rounded-3xl bg-black border border-gray-200 shadow-sm px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search - أسود زي AllProducts */}
            <div className="w-full md:max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-[#212121] border border-neutral-800 px-3 py-2 focus-within:border-white focus-within:shadow-sm transition">
                <Search className="w-4 h-4 text-neutral-300" />
                <input
                  type="text"
                  placeholder="Search eyeglasses by name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs md:text-sm text-white placeholder:text-neutral-500"
                />
              </div>
            </div>

            {/* Mobile filters button فقط للموبايل */}
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-black md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 text-black" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: Desktop => filters جنب الجريد */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* SIDEBAR (Desktop only) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                shapes={shapes}
                frameMaterials={frameMaterials}
                genders={genders}
                shapeFilter={shapeFilter}
                setShapeFilter={setShapeFilter}
                frameFilter={frameFilter}
                setFrameFilter={setFrameFilter}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* PRODUCTS SIDE */}
          <main className="flex-1">
            {/* Quick gender chips: All / Men / Women */}
            {genders.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
                <FilterChip
                  label="All"
                  active={genderFilter === ""}
                  onClick={() => setGenderFilter("")}
                />
                <FilterChip
                  label="Men"
                  active={genderFilter.toLowerCase() === "men"}
                  onClick={() => setGenderFilter("Men")}
                />
                <FilterChip
                  label="Women"
                  active={genderFilter.toLowerCase() === "women"}
                  onClick={() => setGenderFilter("Women")}
                />
              </div>
            )}

            {/* count (mobile & desktop) */}
            <div className="mb-3 text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{" "}
              of {eyeProducts.length} eyeglasses
            </div>

            {/* grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <p className="text-sm font-medium text-black">
                  No eyeglasses match your filters.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Try adjusting the filters or search term.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group rounded-3xl bg-white border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  >
                    <ProductCard
                      product={product}
                      linkTo={`/products/${product.id}`}
                      showAddToCart={false}
                      badge={null}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-40 flex items-end lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative z-50 w-full rounded-t-3xl bg-[#050505] text-white shadow-2xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold">Filters</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            <FilterPanel
              shapes={shapes}
              frameMaterials={frameMaterials}
              genders={genders}
              shapeFilter={shapeFilter}
              setShapeFilter={setShapeFilter}
              frameFilter={frameFilter}
              setFrameFilter={setFrameFilter}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <button
              type="button"
              onClick={() => setShowMobileFilters(false)}
              className="mt-4 w-full rounded-full bg-white text-black text-xs py-2.5 font-medium"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ----------------- COMPONENTS ----------------- */

function FilterPanel({
  shapes,
  frameMaterials,
  genders,
  shapeFilter,
  setShapeFilter,
  frameFilter,
  setFrameFilter,
  genderFilter,
  setGenderFilter,
  clearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="rounded-3xl bg-[#050505] border border-neutral-800 shadow-sm p-4 space-y-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Filters</span>
          <span className="text-[11px] text-neutral-400">
            Refine eyeglasses by details
          </span>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className={`text-[11px] ${
            hasActiveFilters
              ? "text-neutral-300 hover:text-white"
              : "text-neutral-600 cursor-not-allowed"
          }`}
        >
          Clear all
        </button>
      </div>

      {/* Gender */}
      {genders.length > 0 && (
        <SidebarSelect
          label="Gender"
          value={genderFilter}
          onChange={setGenderFilter}
          options={genders}
          allLabel="All"
        />
      )}

      {/* Shape */}
      <SidebarSelect
        label="Shape"
        value={shapeFilter}
        onChange={setShapeFilter}
        options={shapes}
        allLabel="All shapes"
      />

      {/* Frame material */}
      <SidebarSelect
        label="Frame material"
        value={frameFilter}
        onChange={setFrameFilter}
        options={frameMaterials}
        allLabel="All frames"
      />
    </div>
  );
}

function SidebarSelect({ label, value, onChange, options, allLabel }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-white outline-none hover:border-neutral-400"
        >
          <option value="">{allLabel}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500">
          ▼
        </span>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`px-3 py-1.5 rounded-full text-[11px] border transition-all duration-200 ${
        active
          ? "bg-black text-white border-black shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
