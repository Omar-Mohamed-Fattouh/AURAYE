import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";

export default function MenProduct({ products = [], loading = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [shapeFilter, setShapeFilter] = useState("");
  const [frameFilter, setFrameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // category
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getCategoryName = (p) =>
    (typeof p.category === "string" ? p.category : p.category?.name) || "";

  // ✅ Men products from props
  const menProducts = useMemo(() => {
    return (products || []).filter((p) => {
      const gender = String(p.gender || "").toLowerCase().trim();
      const cat = String(getCategoryName(p) || "").toLowerCase().trim();
      return gender === "men" || cat === "men";
    });
  }, [products]);

  const shapes = useMemo(() => {
    const set = new Set(
      menProducts.map((p) => p.shape).filter((s) => s && String(s).trim() !== "")
    );
    return Array.from(set);
  }, [menProducts]);

  const frameMaterials = useMemo(() => {
    const set = new Set(
      menProducts
        .map((p) => p.frameMaterial)
        .filter((m) => m && String(m).trim() !== "")
    );
    return Array.from(set);
  }, [menProducts]);

  const types = useMemo(() => {
    const set = new Set(
      menProducts
        .map((p) => getCategoryName(p))
        .filter((c) => c && String(c).trim() !== "")
    );
    return Array.from(set);
  }, [menProducts]);

  const filteredProducts = useMemo(() => {
    return menProducts.filter((p) => {
      const name = (p.name || p.title || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const nameMatch = !search || name.includes(search);

      const shapeMatch =
        !shapeFilter || String(p.shape).toLowerCase() === shapeFilter.toLowerCase();

      const frameMatch =
        !frameFilter ||
        String(p.frameMaterial).toLowerCase() === frameFilter.toLowerCase();

      const categoryName = getCategoryName(p);
      const typeMatch =
        !typeFilter || String(categoryName).toLowerCase() === typeFilter.toLowerCase();

      return nameMatch && shapeMatch && frameMatch && typeMatch;
    });
  }, [menProducts, searchTerm, shapeFilter, frameFilter, typeFilter]);

  const hasActiveFilters = !!(typeFilter || shapeFilter || frameFilter);

  const clearFilters = () => {
    setTypeFilter("");
    setShapeFilter("");
    setFrameFilter("");
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-wide">Loading products…</p>
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
                Men’s Collection
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-500 max-w-xl">
                Explore men’s eyeglasses and sunglasses. Use search and filters to find the perfect frame.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-gray-600">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Total products: <span className="font-medium text-black">{menProducts.length}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Showing: <span className="font-medium text-black">{filteredProducts.length}</span>
              </div>
            </div>
          </div>

          {/* Search + mobile filters */}
          <div className="rounded-3xl bg-black border border-gray-200 shadow-sm px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-[#212121] border border-neutral-800 px-3 py-2 focus-within:border-white focus-within:shadow-sm transition">
                <Search className="w-4 h-4 text-neutral-300" />
                <input
                  type="text"
                  placeholder="Search men’s frames by name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs md:text-sm text-white placeholder:text-neutral-500"
                />
              </div>
            </div>

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

        {/* MAIN */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                types={types}
                shapes={shapes}
                frameMaterials={frameMaterials}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                shapeFilter={shapeFilter}
                setShapeFilter={setShapeFilter}
                frameFilter={frameFilter}
                setFrameFilter={setFrameFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            {types.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
                <FilterChip label="All" active={typeFilter === ""} onClick={() => setTypeFilter("")} />
                {types.map((t) => (
                  <FilterChip key={t} label={t} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
                ))}
              </div>
            )}

            <div className="mb-3 text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">{filteredProducts.length}</span>{" "}
              of {menProducts.length} products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <p className="text-sm font-medium text-black">No products match your filters.</p>
                <p className="mt-1 text-xs text-gray-500">Try adjusting the filters or search term.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const id = product.id ?? product.productId;
                  return (
                    <div
                      key={id}
                      className="group rounded-3xl bg-white border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                    >
                      <ProductCard product={product} linkTo={`/products/${id}`} showAddToCart={false} badge={null} />
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-40 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
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
              types={types}
              shapes={shapes}
              frameMaterials={frameMaterials}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              shapeFilter={shapeFilter}
              setShapeFilter={setShapeFilter}
              frameFilter={frameFilter}
              setFrameFilter={setFrameFilter}
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
  types,
  shapes,
  frameMaterials,
  typeFilter,
  setTypeFilter,
  shapeFilter,
  setShapeFilter,
  frameFilter,
  setFrameFilter,
  clearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="rounded-3xl bg-[#050505] border border-neutral-800 shadow-sm p-4 space-y-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Filters</span>
          <span className="text-[11px] text-neutral-400">Refine men’s collection by details</span>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className={`text-[11px] ${
            hasActiveFilters ? "text-neutral-300 hover:text-white" : "text-neutral-600 cursor-not-allowed"
          }`}
        >
          Clear all
        </button>
      </div>

      {types.length > 0 && (
        <SidebarSelect label="Type" value={typeFilter} onChange={setTypeFilter} options={types} allLabel="All types" />
      )}

      <SidebarSelect label="Shape" value={shapeFilter} onChange={setShapeFilter} options={shapes} allLabel="All shapes" />

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
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{label}</p>
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
