// src/pages/AllProducts.jsx
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // search
  const [searchTerm, setSearchTerm] = useState("");

  // filters
  const [genderFilter, setGenderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shapeFilter, setShapeFilter] = useState("all");
  const [frameFilter, setFrameFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // price
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // sort
  const [sortBy, setSortBy] = useState("recommended");

  // mobile filters sheet
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const getId = (p) => p.productId ?? p.id;
  const getTitle = (p) => p.title || p.name || "";
  const getCategoryName = (p) =>
    (typeof p.category === "string" ? p.category : p.category?.name) || "";

  /* ---------- OPTIONS من الداتا ---------- */

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
        .map((p) => getCategoryName(p))
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

  const sizeOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.sizes)) {
        p.sizes.forEach((s) => {
          if (s && String(s).trim() !== "") set.add(s);
        });
      }
    });
    return Array.from(set);
  }, [products]);

  const colorOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.productImages)) {
        p.productImages.forEach((img) => {
          if (img?.color && String(img.color).trim() !== "") {
            set.add(img.color);
          }
        });
      }
    });
    return Array.from(set);
  }, [products]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!products.length) return { minPrice: 0, maxPrice: 0 };
    const prices = products
      .map((p) => Number(p.price))
      .filter((x) => !Number.isNaN(x));
    if (!prices.length) return { minPrice: 0, maxPrice: 0 };
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);

  useEffect(() => {
    if (minPrice && maxPrice && priceFrom === "" && priceTo === "") {
      setPriceFrom(minPrice);
      setPriceTo(maxPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  /* ---------- MAIN FILTER + SORT ---------- */

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const title = getTitle(p);
      const categoryName = getCategoryName(p);
      const search = searchTerm.trim().toLowerCase();

      const haystack = [
        title,
        p.description || "",
        categoryName,
        p.shape || "",
        p.gender || "",
        p.frameMaterial || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = search === "" || haystack.includes(search);

      const matchesGender =
        genderFilter === "all" ||
        (p.gender &&
          p.gender.toLowerCase() === genderFilter.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        (categoryName &&
          categoryName.toLowerCase() === categoryFilter.toLowerCase());

      const matchesShape =
        shapeFilter === "all" ||
        (p.shape &&
          p.shape.toLowerCase() === shapeFilter.toLowerCase());

      const matchesFrame =
        frameFilter === "all" ||
        (p.frameMaterial &&
          p.frameMaterial.toLowerCase() === frameFilter.toLowerCase());

      const matchesSize =
        sizeFilter === "all" ||
        (Array.isArray(p.sizes) &&
          p.sizes
            .map((s) => String(s).toLowerCase())
            .includes(sizeFilter.toLowerCase()));

      const matchesColor =
        colorFilter === "all" ||
        (Array.isArray(p.productImages) &&
          p.productImages.some(
            (img) =>
              img?.color &&
              img.color.toLowerCase() === colorFilter.toLowerCase()
          ));

      const matchesAvailability = !inStockOnly || p.isAvailable;

      const price = Number(p.price);
      const from = Number(priceFrom) || minPrice || 0;
      const to = Number(priceTo) || maxPrice || Infinity;
      const matchesPrice =
        Number.isFinite(price) && price >= from && price <= to;

      return (
        matchesSearch &&
        matchesGender &&
        matchesCategory &&
        matchesShape &&
        matchesFrame &&
        matchesSize &&
        matchesColor &&
        matchesAvailability &&
        matchesPrice
      );
    });

    if (sortBy === "price-asc") {
      result = [...result].sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    } else if (sortBy === "price-desc") {
      result = [...result].sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => {
        const da = new Date(a.createdAt || 0).getTime();
        const db = new Date(b.createdAt || 0).getTime();
        if (da && db) return db - da;
        return (b.productId ?? b.id ?? 0) - (a.productId ?? a.id ?? 0);
      });
    } else {
      // recommended
      result = [...result].sort(
        (a, b) => (b.productId ?? b.id ?? 0) - (a.productId ?? a.id ?? 0)
      );
    }

    return result;
  }, [
    products,
    searchTerm,
    genderFilter,
    categoryFilter,
    shapeFilter,
    frameFilter,
    sizeFilter,
    colorFilter,
    inStockOnly,
    priceFrom,
    priceTo,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const resetFilters = () => {
    setGenderFilter("all");
    setCategoryFilter("all");
    setShapeFilter("all");
    setFrameFilter("all");
    setSizeFilter("all");
    setColorFilter("all");
    setInStockOnly(false);
    setSortBy("recommended");
    setPriceFrom(minPrice);
    setPriceTo(maxPrice);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500 tracking-wide">
          Loading products…
        </p>
      </section>
    );
  }

  /* ---------- UI ---------- */

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="w-full mx-auto px-4 lg:px-8">
        {/* TOP BAR */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-black tracking-tight">
                All Products
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-500">
                Browse our full collection and fine-tune with advanced filters.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs text-gray-600">
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Total products:{" "}
                <span className="font-medium text-black">
                  {products.length}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                Showing:{" "}
                <span className="font-medium text-black">
                  {filteredProducts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search + sort + mobile filter btn */}
          <div className="rounded-3xl bg-black border border-gray-200 shadow-sm px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* search (أسود زي الفيلترز) */}
            <div className="w-full md:max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-[#242424] border border-neutral-800 px-3 py-2 focus-within:border-white focus-within:shadow-sm transition">
                <Search className="w-4 h-4 text-white" />
                <input
                  type="text"
                  placeholder="Search name, shape, material, category…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-xs md:text-sm text-white placeholder:text-white"
                />
              </div>
            </div>

            {/* sort + mobile filters */}
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-white">
                  Sort
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#242424] border border-neutral-800 rounded-full pl-3 pr-8 py-1.5 text-xs text-white outline-none hover:border-black"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white">
                    ▼
                  </span>
                </div>
              </div>

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

        {/* MAIN LAYOUT */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="hidden lg:block sticky top-24">
              <FilterPanel
                {...{
                  genderFilter,
                  setGenderFilter,
                  categoryFilter,
                  setCategoryFilter,
                  shapeFilter,
                  setShapeFilter,
                  frameFilter,
                  setFrameFilter,
                  sizeFilter,
                  setSizeFilter,
                  colorFilter,
                  setColorFilter,
                  inStockOnly,
                  setInStockOnly,
                  priceFrom,
                  setPriceFrom,
                  priceTo,
                  setPriceTo,
                  minPrice,
                  maxPrice,
                  resetFilters,
                  genderOptions,
                  categoryOptions,
                  shapeOptions,
                  frameOptions,
                  sizeOptions,
                  colorOptions,
                }}
              />
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <main className="flex-1">
            {/* quick chips: All Products / Men / Women / Sunglasses */}
            <div className="mb-4 flex flex-wrap gap-2 text-[11px]">
              <QuickChip
                label="All Products"
                active={
                  genderFilter === "all" &&
                  categoryFilter === "all"
                }
                onClick={() => {
                  setGenderFilter("all");
                  setCategoryFilter("all");
                }}
              />
              <QuickChip
                label="Men"
                active={genderFilter.toLowerCase() === "men"}
                onClick={() => setGenderFilter("men")}
              />
              <QuickChip
                label="Women"
                active={genderFilter.toLowerCase() === "women"}
                onClick={() => setGenderFilter("women")}
              />
              <QuickChip
                label="Sunglasses"
                active={
                  categoryFilter.toLowerCase() === "sunglasses"
                }
                onClick={() => setCategoryFilter("Sunglasses")}
              />
            </div>

            {/* count */}
            <div className="mb-3 text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">
                {filteredProducts.length}
              </span>{" "}
              of {products.length} products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <p className="text-sm font-medium text-black">
                  No products match your filters.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Try adjusting the filters or widening the price range.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
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
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-40 flex items-end md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
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
              {...{
                genderFilter,
                setGenderFilter,
                categoryFilter,
                setCategoryFilter,
                shapeFilter,
                setShapeFilter,
                frameFilter,
                setFrameFilter,
                sizeFilter,
                setSizeFilter,
                colorFilter,
                setColorFilter,
                inStockOnly,
                setInStockOnly,
                priceFrom,
                setPriceFrom,
                priceTo,
                setPriceTo,
                minPrice,
                maxPrice,
                resetFilters,
                genderOptions,
                categoryOptions,
                shapeOptions,
                frameOptions,
                sizeOptions,
                colorOptions,
              }}
            />

            <button
              type="button"
              onClick={() => setShowMobileFilters(false)}
              className="mt-4 w-full rounded-full bg.white text-black text-xs py-2.5 font-medium"
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

function FilterPanel(props) {
  const {
    genderFilter,
    setGenderFilter,
    categoryFilter,
    setCategoryFilter,
    shapeFilter,
    setShapeFilter,
    frameFilter,
    setFrameFilter,
    sizeFilter,
    setSizeFilter,
    colorFilter,
    setColorFilter,
    inStockOnly,
    setInStockOnly,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    minPrice,
    maxPrice,
    resetFilters,
    genderOptions,
    categoryOptions,
    shapeOptions,
    frameOptions,
    sizeOptions,
    colorOptions,
  } = props;

  return (
    <div className="rounded-3xl bg-[#050505] border border-neutral-800 shadow-sm p-4 space-y-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Filters</span>
          <span className="text-[11px] text-neutral-400">
            Refine results by product details
          </span>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-[11px] text-neutral-400 hover:text-white"
        >
          Clear all
        </button>
      </div>

      <SidebarSelect
        label="Category"
        value={categoryFilter}
        onChange={setCategoryFilter}
        options={categoryOptions}
        allLabel="All categories"
      />

      <SidebarSelect
        label="Gender"
        value={genderFilter}
        onChange={setGenderFilter}
        options={genderOptions}
        allLabel="All"
      />

      <SidebarSelect
        label="Shape"
        value={shapeFilter}
        onChange={setShapeFilter}
        options={shapeOptions}
        allLabel="Any shape"
      />

      <SidebarSelect
        label="Frame material"
        value={frameFilter}
        onChange={setFrameFilter}
        options={frameOptions}
        allLabel="Any material"
      />

      {sizeOptions.length > 0 && (
        <SidebarSelect
          label="Size"
          value={sizeFilter}
          onChange={setSizeFilter}
          options={sizeOptions}
          allLabel="Any size"
        />
      )}

      {colorOptions.length > 0 && (
        <SidebarSelect
          label="Color"
          value={colorFilter}
          onChange={setColorFilter}
          options={colorOptions}
          allLabel="Any color"
        />
      )}

      {/* price */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Price (EGP)
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[11px] text-neutral-400">From</label>
            <input
              type="number"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-xs text-white outline-none focus:border-white"
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] text-neutral-400">To</label>
            <input
              type="number"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-xs text-white outline-none focus:border-white"
            />
          </div>
        </div>
        {minPrice !== maxPrice && (
          <p className="mt-1 text-[11px] text-neutral-500">
            Range: {minPrice} – {maxPrice} EGP
          </p>
        )}
      </div>

      {/* availability */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Availability
        </p>
        <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-neutral-500 bg-neutral-900 text-white focus:ring-white"
          />
          <span>In stock only</span>
        </label>
      </div>
    </div>
  );
}

function SidebarSelect({ label, value, onChange, options, allLabel }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-white outline-none hover:border-neutral-400"
        >
          <option value="all">{allLabel}</option>
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

function QuickChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-[11px] transition ${
        active
          ? "bg-black text-white border-black"
          : "bg-white text-gray-800 border-gray-300 hover:border-black"
      }`}
    >
      {label}
    </button>
  );
}
