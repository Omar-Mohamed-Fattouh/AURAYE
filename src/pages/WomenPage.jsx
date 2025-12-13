import { useCallback, useEffect, useMemo, useState } from "react";

import WomenProduct from "../components/WomenProduct";
import DealsSection from "../components/DealSeaction";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";

import { getProducts, getBestSellerProducts } from "../api/productsApi";

const WomenPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [all, best] = await Promise.all([
        getProducts(),
        getBestSellerProducts(),
      ]);

      const allArr = Array.isArray(all)
        ? all
        : Array.isArray(all?.data)
        ? all.data
        : [];

      const bestArr = Array.isArray(best)
        ? best
        : Array.isArray(best?.data)
        ? best.data
        : [];

      setAllProducts(allArr);
      setBestSellers(bestArr);
    } catch (e) {
      console.error("WomenPage load failed:", e);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const womenProducts = useMemo(() => {
    return (allProducts || []).filter((p) => {
      const gender = String(p.gender || "").toLowerCase().trim();
      const cat =
        typeof p.category === "string"
          ? String(p.category)
          : String(p.category?.name || "");
      const catLower = cat.toLowerCase().trim();

      return gender === "women" || catLower === "women";
    });
  }, [allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-black/20 border-t-black animate-spin" />
          <p className="text-sm text-black/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full rounded-2xl border border-black/10 p-6 text-center">
          <p className="text-sm text-black/80 mb-4">{error}</p>
          <button
            onClick={fetchAll}
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
      <WomenProduct products={womenProducts} loading={loading} />
      <DealsSection products={womenProducts} loading={loading} />
      <BestSellerSection products={bestSellers} loading={loading} />
      <SubscribeSection />
    </div>
  );
};

export default WomenPage;
