// src/pages/AllProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + filters + sort
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shapeFilter, setShapeFilter] = useState("all");
  const [frameFilter, setFrameFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default"); // default | price-asc | price-desc | newest

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

  // options for dropdowns
  const genderOptions = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.gender)
        .filter((g) => g && String(g).trim() !== "")
    );
    return Array.from(set);
  }, [products]);

  const categoryOptions = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.category)
        .filter((c) => c && String(c).trim() !== "")
    );
    return Array.from(set);
  }, [products]);

  const shapeOptions = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.shape)
        .filter((s) => s && String(s).trim() !== "")
    );
    return Array.from(set);
  }, [products]);

  const frameOptions = useMemo(() => {
    const set = new Set(
      products
        .map((p) => p.frameMaterial)
        .filter((f) => f && String(f).trim() !== "")
    );
    return Array.from(set);
  }, [products]);

  // filter + sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const nameMatch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      const genderMatch =
        genderFilter === "all" ||
        (p.gender &&
          p.gender.toLowerCase() === genderFilter.toLowerCase());

      const categoryMatch =
        categoryFilter === "all" ||
        (p.category &&
          p.category.toLowerCase() === categoryFilter.toLowerCase());

      const shapeMatch =
        shapeFilter === "all" ||
        (p.shape &&
          p.shape.toLowerCase() === shapeFilter.toLowerCase());

      const frameMatch =
        frameFilter === "all" ||
        (p.frameMaterial &&
          p.frameMaterial.toLowerCase() === frameFilter.toLowerCase());

      return nameMatch && genderMatch && categoryMatch && shapeMatch && frameMatch;
    });

    // ✅ sorting شغال فعلاً
    const sorted = [...result];

    if (sortBy === "price-asc") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "newest") {
      // لو مفيش field للـ date هنفترض إن الـ id الأكبر = أحدث
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return sorted;
  }, [
    products,
    searchTerm,
    genderFilter,
    categoryFilter,
    shapeFilter,
    frameFilter,
    sortBy,
  ]);

  const handleReset = () => {
    setSearchTerm("");
    setGenderFilter("all");
    setCategoryFilter("all");
    setShapeFilter("all");
    setFrameFilter("all");
    setSortBy("default");
  };

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
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            All Products
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Browse our full collection and refine using search, filters, and sort.
          </p>
        </div>

        {/* Filters bar (Navbar-style) */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onReset={handleReset}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={[
            {
              key: "gender",
              label: "Gender",
              value: genderFilter,
              onChange: setGenderFilter,
              options: genderOptions,
            },
            {
              key: "category",
              label: "Category",
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: categoryOptions,
            },
            {
              key: "shape",
              label: "Shape",
              value: shapeFilter,
              onChange: setShapeFilter,
              options: shapeOptions,
            },
            {
              key: "frame",
              label: "Frame",
              value: frameFilter,
              onChange: setFrameFilter,
              options: frameOptions,
            },
          ]}
        />

        {/* Result count */}
        <p className="text-xs text-gray-500 mb-3">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            No products match your filters. Try changing search or filters.
          </p>
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
