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
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const loadEyeProducts = async () => {
      try {
        const all = await getProducts();

        const filtered = all.filter(
          (p) => String(p.category).toLowerCase() === "eyeglasses"
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
      const nameMatch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

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
      <section className="py-16">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500">Loading eyeglasses...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-6 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Eyeglasses
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            Browse our eyeglasses collection for everyday comfort and style.
            Use search and filters to narrow down your options.
          </p>
        </div>

        {/* Search + filters bar */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center">
            <div
              className="
                w-full md:w-2/3 
                bg-gray-50 border border-gray-200 
                rounded-full px-4 py-2 
                flex items-center gap-2
                shadow-sm
                transition-all duration-200 ease-out
                focus-within:border-black focus-within:bg-white focus-within:shadow-md
              "
            >
              <Search
                size={18}
                className="text-gray-400 flex-shrink-0 transition-colors duration-200"
              />
              <input
                type="text"
                placeholder="Search eyeglasses by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full bg-transparent outline-none text-sm
                  placeholder:text-gray-400
                "
              />
            </div>

            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="
                ml-3 inline-flex items-center gap-1 
                px-3 py-2 rounded-full text-sm
                border border-gray-200 bg-white
                hover:bg-gray-50 hover:border-black
                transition-all duration-200 ease-out
              "
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">
                {filtersOpen ? "Hide filters" : "Show filters"}
              </span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>

          {/* Gender chips row */}
          {genders.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              <FilterChip
                label="All"
                active={genderFilter === ""}
                onClick={() => setGenderFilter("")}
              />
              {genders.map((g) => (
                <FilterChip
                  key={g}
                  label={g}
                  active={genderFilter === g}
                  onClick={() =>
                    setGenderFilter((prev) => (prev === g ? "" : g))
                  }
                />
              ))}
            </div>
          )}

          {/* Advanced filters panel */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-out
              ${filtersOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}
            `}
          >
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                {/* Shape */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500">
                    Shape
                  </span>
                  <select
                    value={shapeFilter}
                    onChange={(e) => setShapeFilter(e.target.value)}
                    className="
                      min-w-[160px] border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white
                      focus:outline-none focus:ring-1 focus:ring-black
                      transition-all duration-150
                    "
                  >
                    <option value="">All shapes</option>
                    {shapes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frame material */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500">
                    Frame material
                  </span>
                  <select
                    value={frameFilter}
                    onChange={(e) => setFrameFilter(e.target.value)}
                    className="
                      min-w-[160px] border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white
                      focus:outline-none focus:ring-1 focus:ring-black
                      transition-all duration-150
                    "
                  >
                    <option value="">All frames</option>
                    {frameMaterials.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear filters button */}
              <div className="flex items-center justify-end mt-1 md:mt-0">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={`
                    inline-flex items-center gap-1 text-xs font-medium
                    px-3 py-1.5 rounded-full
                    border
                    transition-all duration-200
                    ${
                      hasActiveFilters
                        ? "border-gray-300 text-gray-700 hover:border-black hover:bg:white"
                        : "border-gray-200 text-gray-300 cursor-not-allowed"
                    }
                  `}
                >
                  <X size={14} />
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-xs text-gray-500">
          Showing {filteredProducts.length} of {eyeProducts.length} eyeglasses
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 text-gray-500 text-sm">
            No eyeglasses found. Try changing the search or filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                linkTo={`/products/${product.id}`}
                showAddToCart={false}
                badge={null}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full text-xs md:text-sm
        border
        transition-all duration-200 ease-out
        ${
          active
            ? "bg-black text-white border-black shadow-sm"
            : "bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50"
        }
      `}
    >
      {label}
    </button>
  );
}
