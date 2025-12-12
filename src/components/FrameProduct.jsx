import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";

export default function FrameProduct({ products = [], loading = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [frameFilter, setFrameFilter] = useState("");

  const norm = (v) => String(v ?? "").trim().toLowerCase();

  // ✅ options من الداتا
  const frameTypes = useMemo(() => {
    const set = new Set(
      (products || [])
        .map((p) => p.frameMaterial)
        .filter((m) => m && String(m).trim() !== "")
    );
    return Array.from(set);
  }, [products]);

  // ✅ search + filter
  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
      const name = (p.name || p.title || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const nameMatch = !search || name.includes(search);
      const frameMatch = !frameFilter || norm(p.frameMaterial) === norm(frameFilter);

      return nameMatch && frameMatch;
    });
  }, [products, searchTerm, frameFilter]);

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-wide">Loading frames…</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="w-full mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-black tracking-tight">
                Frame Materials
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-500 max-w-2xl">
                Explore frames by material (Acetate, Metal, Titanium, Mixed, and more).
                Use the search and material chips to find the perfect match.
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Showing{" "}
                <span className="font-semibold text-black">
                  {filteredProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-black">
                  {products.length}
                </span>{" "}
                products
              </p>
            </div>

            {/* Desktop small stats */}
            <div className="hidden md:flex items-center gap-3 text-xs text-gray-600">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Materials:{" "}
                <span className="font-medium text-black">{frameTypes.length}</span>
              </div>
            </div>
          </div>

          {/* Search block */}
          <div className="rounded-3xl bg-black border border-gray-200 shadow-sm px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-[#212121] border border-neutral-800 px-3 py-2 focus-within:border-white focus-within:shadow-sm transition">
                <Search className="w-4 h-4 text-neutral-300" />
                <input
                  type="text"
                  placeholder="Search frames…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs md:text-sm text-white placeholder:text-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Material Chips */}
        {frameTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 text-[11px]">
            <FilterChip
              label="All materials"
              active={frameFilter === ""}
              onClick={() => setFrameFilter("")}
            />
            {frameTypes.map((material) => (
              <FilterChip
                key={material}
                label={material}
                active={norm(frameFilter) === norm(material)}
                onClick={() => setFrameFilter(material)}
              />
            ))}
          </div>
        )}

        {/* GRID */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
            <p className="text-sm font-medium text-black">No frames found.</p>
            <p className="mt-1 text-xs text-gray-500">
              Try another material or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => {
              const id = product.id ?? product.productId;
              return (
                <div
                  key={id}
                  className="group rounded-3xl bg-white border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                >
                  <ProductCard
                    product={product}
                    linkTo={`/products/${id}`}
                    showAddToCart={false}
                    badge={null}
                  />
                </div>
              );
            })}
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
      type="button"
      className={`px-3 py-1.5 rounded-full text-[11px] md:text-sm border transition-all duration-200 ease-out ${
        active
          ? "bg-black text-white border-black shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
