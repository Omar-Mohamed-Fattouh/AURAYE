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
        setProducts(all);
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
      const nameMatch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      const frameMatch =
        !frameFilter ||
        String(p.frameMaterial).toLowerCase() ===
          frameFilter.toLowerCase();

      return nameMatch && frameMatch;
    });
  }, [products, searchTerm, frameFilter]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500">Loading frames...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/*Title*/}
        <div className="mb-6 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Shop by Frame Material
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            Choose between acetate, metal, titanium, mixed materials, and more.
            Use filters to find your perfect frame.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
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
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search frames..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full bg-transparent outline-none text-sm
                placeholder:text-gray-400
              "
            />
          </div>
        </div>

        {/* Frame Material Chips */}
        {frameTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterChip
              label="All Materials"
              active={frameFilter === ""}
              onClick={() => setFrameFilter("")}
            />
            {frameTypes.map((material) => (
              <FilterChip
                key={material}
                label={material}
                active={frameFilter === material}
                onClick={() =>
                  setFrameFilter((prev) =>
                    prev === material ? "" : material
                  )
                }
              />
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-xs text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* GRID */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 text-gray-500 text-sm">
            No frames found. Try another material or search term.
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
