import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ProductDetails from "../components/ProductDetails";
import RelatedProducts from "../components/RelatedProducts";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";
import AurayeLoader from "../components/AurayeLoader";

import {
  getProductById,
  getProducts,
  getBestSellerProducts,
} from "../api/productsApi";

const ProductID = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [pRes, allRes, bestRes] = await Promise.all([
        getProductById(id),
        getProducts(),
        getBestSellerProducts(),
      ]);

      const p = pRes?.data ?? pRes; // ✅ handle axios or raw object
      if (!p) {
        setLoading(false);
        navigate("/NotFoundPage", { replace: true });
        return;
      }

      const allArr = Array.isArray(allRes)
        ? allRes
        : Array.isArray(allRes?.data)
        ? allRes.data
        : [];

      const bestArr = Array.isArray(bestRes)
        ? bestRes
        : Array.isArray(bestRes?.data)
        ? bestRes.data
        : [];

      setProduct(p);
      setAllProducts(allArr);
      setBestSellers(bestArr);
    } catch (e) {
      console.error("ProductID load failed:", e);
      setError("Failed to load product data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchAll();
  }, [id, fetchAll]);

  if (loading) return <AurayeLoader label="Loading product" subtitle="AURAYE" />;

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
      <ProductDetails product={product} />
      <RelatedProducts currentProduct={product} products={allProducts} />
      <BestSellerSection products={bestSellers} />
      <SubscribeSection />
    </div>
  );
};

export default ProductID;
