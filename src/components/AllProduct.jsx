// src/pages/AllProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

import "swiper/css";
import "swiper/css/navigation";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + filters
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shapeFilter, setShapeFilter] = useState("all");
  const [frameFilter, setFrameFilter] = useState("all");

  // sort
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

  // unique values for dropdowns
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

  // MAIN FILTERED + SORTED LIST
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

    // sorting
    if (sortBy === "price-asc") {
      result = [...result].sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    } else if (sortBy === "price-desc") {
      result = [...result].sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    } else if (sortBy === "newest") {
      // assuming higher id = newer
      result = [...result].sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [
    products,
    searchTerm,
    genderFilter,
    categoryFilter,
    shapeFilter,
    frameFilter,
    sortBy,
  ]);

  // category-based carousels
  const menProducts = products.filter(
    (p) => p.gender && p.gender.toLowerCase() === "men"
  );
  const womenProducts = products.filter(
    (p) => p.gender && p.gender.toLowerCase() === "women"
  );
  const sunglassesProducts = products.filter(
    (p) => p.category && p.category.toLowerCase().includes("sunglass")
  );
  const eyeglassesProducts = products.filter(
    (p) => p.category && p.category.toLowerCase().includes("eyeglass")
  );

  const resetFilters = () => {
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
        {/* HEADER */}
        <div className="mb-6 space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            All Products
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl">
            Explore all our eyewear in one place. Use search and filters or jump
            into each category carousel.
          </p>
        </div>

        {/* SEARCH + FILTER BAR */}
        <div className="mb-8 flex flex-col gap-3">
          {/* Search */}
          <div
            className="
              w-full 
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
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Reset + Sort row */}
          <div className="flex items-center justify-between gap-3 text-xs md:text-sm">
            {/* Reset pill */}
            <button
              onClick={resetFilters}
              className="
                inline-flex items-center gap-2
                px-3 py-1 rounded-full
                border border-gray-300
                text-gray-700
                hover:bg-gray-100
                transition-all duration-150
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              Reset filters
            </button>

            {/* Sort by */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Sort by</span>
              <div
                className="
                  bg-gray-50 border border-gray-200 
                  rounded-full px-3 py-1.5
                  transition-all duration-150
                  focus-within:border-black focus-within:bg-white
                "
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    bg-transparent outline-none text-xs md:text-sm
                    appearance-none pr-6
                  "
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid gap-3 md:grid-cols-4">
            <SelectFilter
              label="Gender"
              value={genderFilter}
              onChange={setGenderFilter}
              options={genderOptions}
            />
            <SelectFilter
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
            />
            <SelectFilter
              label="Shape"
              value={shapeFilter}
              onChange={setShapeFilter}
              options={shapeOptions}
            />
            <SelectFilter
              label="Frame Material"
              value={frameFilter}
              onChange={setFrameFilter}
              options={frameOptions}
            />
          </div>

          {/* Result Count */}
          <p className="text-xs text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* CATEGORY CAROUSELS */}
        <div className="space-y-10 mb-10">
          {/* Men */}
          {menProducts.length > 0 && (
            <CategoryCarousel
              title="Men"
              linkTo="/products/men"
              swiperPrevClass="men-prev"
              swiperNextClass="men-next"
              products={menProducts}
            />
          )}

          {/* Women */}
          {womenProducts.length > 0 && (
            <CategoryCarousel
              title="Women"
              linkTo="/products/women"
              swiperPrevClass="women-prev"
              swiperNextClass="women-next"
              products={womenProducts}
            />
          )}

          {/* Sunglasses */}
          {sunglassesProducts.length > 0 && (
            <CategoryCarousel
              title="Sunglasses"
              linkTo="/products/sunglasses"
              swiperPrevClass="sun-prev"
              swiperNextClass="sun-next"
              products={sunglassesProducts}
            />
          )}

          {/* Eyeglasses */}
          {eyeglassesProducts.length > 0 && (
            <CategoryCarousel
              title="Eyeglasses"
              linkTo="/products/eyeglasses"
              swiperPrevClass="eye-prev"
              swiperNextClass="eye-next"
              products={eyeglassesProducts}
            />
          )}
        </div>

        {/* MAIN GRID (all filtered) */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            All filtered products
          </h2>

          {filteredProducts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No products match your filters. Try clearing some filters or
              searching for another name.
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
      </div>
    </section>
  );
}

/* ---------- Small reusable components ---------- */

function SelectFilter({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1 text-xs md:text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      <div
        className="
          relative
          bg-gray-50 border border-gray-200 
          rounded-full px-3 py-1.5 
          transition-all duration-200 ease-out
          focus-within:border-black focus-within:bg-white
        "
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full bg-transparent outline-none text-xs md:text-sm
            appearance-none pr-6
          "
        >
          <option value="all">All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}

function CategoryCarousel({
  title,
  linkTo,
  swiperPrevClass,
  swiperNextClass,
  products,
}) {
  if (!products || products.length === 0) return null;

  return (
    <div>
      {/* Header with link */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <Link
          to={linkTo}
          className="text-xs md:text-sm text-gray-700 hover:text-black flex items-center gap-1"
        >
          View all
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* NAV BUTTONS */}
      <div className="flex justify-end gap-3 mb-2">
        <button
          className={`${swiperPrevClass} p-2 border rounded-full hover:bg-gray-100 transition`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className={`${swiperNextClass} p-2 border rounded-full hover:bg-gray-100 transition`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: `.${swiperNextClass}`,
          prevEl: `.${swiperPrevClass}`,
        }}
        spaceBetween={20}
        slidesPerView={5}
        loop={products.length > 5}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          480: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 18 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 5, spaceBetween: 20 },
        }}
        className="pb-4"
      >
        {products.slice(0, 20).map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard
              product={p}
              linkTo={`/products/${p.id}`}
              showAddToCart={false}
              badge={null}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
