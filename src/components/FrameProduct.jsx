// src/pages/FrameProduct.jsx
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function FrameProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [frameFilter, setFrameFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const all = await getProducts();
        setProducts(Array.isArray(all) ? all : []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Get all unique frame materials
  const frameTypes = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.frameMaterial)
        .filter((m) => m && String(m).trim() !== "")
    );
    return Array.from(set);
  }, [products]);

  // Apply search + filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || p.title || "").toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const nameMatch = !search || name.includes(search);

      const frameMatch =
        !frameFilter ||
        String(p.frameMaterial).toLowerCase() ===
          frameFilter.toLowerCase();

      return nameMatch && frameMatch;
    });
  }, [products, searchTerm, frameFilter]);

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-wide">
          Loading frames…
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="w-full mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-black tracking-tight">
              Shop by Frame Material
            </h1>
            <p className="mt-1 text-xs md:text-sm text-gray-500 max-w-xl">
              Choose between acetate, metal, titanium, mixed materials, and more.
              Use search and filters to find your perfect frame.
            </p>
          </div>

          {/* Search block (black card) */}
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

        {/* Frame Material Chips */}
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
                active={frameFilter === material}
                onClick={() => setFrameFilter(material)}
            />
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-black">
            {filteredProducts.length}
          </span>{" "}
          of {products.length} products
        </div>

        {/* GRID */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
            <p className="text-sm font-medium text-black">
              No frames found.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Try another material or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      </div>
    </section>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`
        px-3 py-1.5 rounded-full text-[11px] md:text-sm
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
