import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ColorProduct({ products = [], loading = false }) {
  const safeProducts = Array.isArray(products) ? products : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  const colors = useMemo(() => {
    const set = new Set();
    safeProducts.forEach((p) => {
      (p.availableColors || []).forEach((c) => {
        if (c && String(c).trim() !== "") set.add(String(c));
      });
    });
    return Array.from(set);
  }, [safeProducts]);

  const filteredProducts = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();

    return safeProducts.filter((p) => {
      const name = String(p.name || p.title || "").toLowerCase();
      const nameMatch = !s || name.includes(s);

      const colorMatch =
        !colorFilter ||
        (p.availableColors || []).some(
          (c) => String(c).toLowerCase() === String(colorFilter).toLowerCase()
        );

      return nameMatch && colorMatch;
    });
  }, [safeProducts, searchTerm, colorFilter]);

  const getId = (p) => p.productId ?? p.id;

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-wide">Loading products…</p>
      </section>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="w-full mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold text-black tracking-tight">
            Shop by Color
          </h1>
          <p className="text-gray-500 text-xs md:text-sm max-w-xl">
            Choose frames based on color. Use search and color chips to find the
            style that fits your vibe.
          </p>
        </div>

        {/* Search (black card زي باقي الصفحات) */}
        <div className="mb-4 rounded-3xl bg-black border border-gray-200 shadow-sm px-4 py-3">
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

        {/* Color chips */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 text-[11px]">
            <ColorChip
              label="All colors"
              color={null}
              active={colorFilter === ""}
              onClick={() => setColorFilter("")}
            />
            {colors.map((c) => (
              <ColorChip
                key={c}
                label={c}
                color={c}
                active={colorFilter === c}
                onClick={() => setColorFilter((prev) => (prev === c ? "" : c))}
              />
            ))}
          </div>
        )}

        {/* Results count */}
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
              Try another color or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

function ColorChip({ label, color, active, onClick }) {
  const bg = safeColorToCss(color);

  return (
    <button
      onClick={onClick}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-sm border transition-all duration-200 ${
        active
          ? "bg-black text-white border-black shadow-sm"
          : "bg-white text-gray-700 border-gray-300 hover:border-black hover:bg-gray-50"
      }`}
    >
      {color && (
        <span
          className="w-3.5 h-3.5 rounded-full border border-gray-300"
          style={{ backgroundColor: bg }}
        />
      )}
      <span>{label}</span>
    </button>
  );
}

// عشان لو عندك colors زي "Black/Gold" او "Matte Black" ما يكسرش الستايل
function safeColorToCss(color) {
  if (!color) return "transparent";
  const c = String(color).trim().toLowerCase();

  // basic mapping (ضيف اللي عندك)
  const map = {
    black: "#111111",
    white: "#ffffff",
    gray: "#9ca3af",
    grey: "#9ca3af",
    silver: "#d1d5db",
    gold: "#d4af37",
    brown: "#7c4a2d",
    blue: "#2563eb",
    red: "#dc2626",
    green: "#16a34a",
    pink: "#ec4899",
    purple: "#7c3aed",
    yellow: "#eab308",
    orange: "#f97316",
    transparent: "transparent",
  };

  // لو جالك "matte black" او "dark blue" خُد آخر كلمة
  const last = c.split(" ").pop();
  if (map[c]) return map[c];
  if (map[last]) return map[last];

  // جرّب css color name (لو متعرفش هتبقى fallback)
  return c;
}
