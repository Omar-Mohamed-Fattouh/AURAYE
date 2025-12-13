import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ShapeProduct({ products = [], loading = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [shapeFilter, setShapeFilter] = useState("");

  const safeProducts = Array.isArray(products) ? products : [];

  const shapes = useMemo(() => {
    const set = new Set(
      safeProducts
        .map((p) => p.shape)
        .filter((s) => s && String(s).trim() !== "")
    );
    return Array.from(set);
  }, [safeProducts]);

  const filteredProducts = useMemo(() => {
    return safeProducts.filter((p) => {
      const name = (p.name || p.title || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const nameMatch = !search || name.includes(search);

      const shapeMatch =
        !shapeFilter ||
        String(p.shape).toLowerCase() === shapeFilter.toLowerCase();

      return nameMatch && shapeMatch;
    });
  }, [safeProducts, searchTerm, shapeFilter]);

  const getId = (p) => p.productId ?? p.id;

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
                Shop by Shape
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-500 max-w-xl">
                Explore frames by shape and quickly find what fits your style.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-gray-600">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Total products:{" "}
                <span className="font-medium text-black">{safeProducts.length}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Showing:{" "}
                <span className="font-medium text-black">{filteredProducts.length}</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="rounded-3xl bg-black border border-gray-200 shadow-sm px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-[#212121] border border-neutral-800 px-3 py-2 focus-within:border-white focus-within:shadow-sm transition">
                <Search className="w-4 h-4 text-neutral-300" />
                <input
                  type="text"
                  placeholder="Search by product name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs md:text-sm text-white placeholder:text-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shape chips */}
        {shapes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 text-[11px]">
            <FilterChip
              label="All shapes"
              active={shapeFilter === ""}
              onClick={() => setShapeFilter("")}
            />
            {shapes.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={shapeFilter === s}
                onClick={() => setShapeFilter(s)}
              />
            ))}
          </div>
        )}

        {/* Count */}
        <div className="mb-4 text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-black">{filteredProducts.length}</span>{" "}
          of {safeProducts.length} products
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
            <p className="text-sm font-medium text-black">No products found.</p>
            <p className="mt-1 text-xs text-gray-500">
              Try another shape or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const id = getId(product);
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
      className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition-all duration-200 ${
        active
          ? "bg-black text-white border-black shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
