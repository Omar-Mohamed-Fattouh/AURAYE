import { useCallback, useEffect, useMemo, useState } from "react";

import SunGlasses from "../components/SunGlasses";
import DealsSection from "../components/DealSeaction";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";
import AurayeLoader from "../components/AurayeLoader";

import { getProducts, getBestSellerProducts } from "../api/productsApi";

const SunGlassesPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [p, best] = await Promise.all([getProducts(), getBestSellerProducts()]);

      const productsArray = Array.isArray(p)
        ? p
        : Array.isArray(p?.data)
        ? p.data
        : [];

      const bestArray = Array.isArray(best)
        ? best
        : Array.isArray(best?.data)
        ? best.data
        : [];

      setAllProducts(productsArray);
      setBestSellers(bestArray);
    } catch (err) {
      console.error("SunGlassesPage: failed to load data", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ filter sunglasses once in parent
  const sunProducts = useMemo(() => {
    return (allProducts || []).filter((p) => {
      const cat =
        typeof p.category === "string" ? p.category : p.category?.name || "";
      return String(cat).toLowerCase().trim() === "sunglasses";
    });
  }, [allProducts]);

  // ✅ Deals: لو عايزها sunglasses بس بدّل allProducts بـ sunProducts
  const dealsProductsSource = allProducts;

  if (loading) return <AurayeLoader label="Loading sunglasses" subtitle="AURAYE" />;

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full rounded-2xl border border-black/10 p-6 text-center">
          <p className="text-sm text-black/80 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-black/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SunGlasses products={sunProducts} />
      <DealsSection products={dealsProductsSource} />
      <BestSellerSection products={bestSellers} />
      <SubscribeSection />
    </div>
  );
};

export default SunGlassesPage;
