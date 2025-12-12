import { useCallback, useEffect, useState } from "react";

import FrameProduct from "../components/FrameProduct";
import DealsSection from "../components/DealSeaction";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";
import AurayeLoader from "../components/AurayeLoader";

import { getProducts, getBestSellerProducts } from "../api/productsApi";

const FramesPage = () => {
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
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
      console.error("FramesPage: failed to load data", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return <AurayeLoader label="Loading frames" subtitle="AURAYE" />;
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
      <FrameProduct products={products} />
      <DealsSection products={products} />
      <BestSellerSection products={bestSellers} />
      <SubscribeSection />
    </div>
  );
};

export default FramesPage;
