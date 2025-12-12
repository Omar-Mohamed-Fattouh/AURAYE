// src/pages/Home.jsx
import { useEffect, useState, useCallback } from "react";

import AchievementsSection from "../components/AchievementsSection";
import HeroSection from "../components/HeroSection";
import ARVideoSection from "../components/ARVideoSection.";
import DealsSection from "../components/DealSeaction";
import CategoriesSection from "../components/CategoriesSection";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";
import AurayeLoader from "../components/AurayeLoader";
// import Brand from "../components/Brand"
import { getProducts, getBestSellerProducts } from "../api/productsApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [allProducts, best] = await Promise.all([
        getProducts(),
        getBestSellerProducts(),
      ]);

      const productsArray = Array.isArray(allProducts)
        ? allProducts
        : Array.isArray(allProducts?.data)
        ? allProducts.data
        : [];

      const bestArray = Array.isArray(best)
        ? best
        : Array.isArray(best?.data)
        ? best.data
        : [];

      setProducts(productsArray);
      setBestSellers(bestArray);
    } catch (err) {
      console.error("Home: failed to load data", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  if (loading) return <AurayeLoader label="Loading home" subtitle="AURAYE" />;

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full rounded-2xl border border-black/10 p-6 text-center">
          <p className="text-sm text-black/80 mb-4">{error}</p>
          <button
            onClick={fetchHomeData}
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
      <HeroSection products={products} />
      <CategoriesSection />
      {/* <Brand/> */}
      <DealsSection products={products} />
      <BestSellerSection products={bestSellers} />
      <AchievementsSection />
      <SubscribeSection />
      <ARVideoSection />
    </div>
  );
};

export default Home;
