// src/pages/ColorProduct.jsx
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function ColorProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [colorFilter, setColorFilter] = useState("");

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

  const colors = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      (p.availableColors || []).forEach((c) => {
        if (c && String(c).trim() !== "") set.add(c);
      });
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const nameMatch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      // match if any image has the chosen color
      const colorMatch =
        !colorFilter ||
        (p.availableColors || []).some(
          (c) => c.toLowerCase() === colorFilter.toLowerCase()
        );

      return nameMatch && colorMatch;
    });
  }, [products, searchTerm, colorFilter]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500">Loading products...</p>
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
            Shop by Color
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-xl">
            Choose frames based on color. Use the search bar and color chips to
            find the style that fits your vibe.
          </p>
        </div>

        {/* Search */}
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
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full bg-transparent outline-none text-sm
                placeholder:text-gray-400
              "
            />
          </div>
        </div>

        {/* Color chips */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
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
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 text-gray-500 text-sm">
            No products found. Try another color or search term.
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

function ColorChip({ label, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2
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
      {color && (
        <span
          className="w-3 h-3 rounded-full border border-gray-300"
          style={{ backgroundColor: color.toLowerCase() }} // ✅ تنادي الدالة
        />
      )}

      <span>{label}</span>
    </button>
  );
}
