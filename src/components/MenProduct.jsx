// src/pages/MenProduct.jsx
import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function MenProduct() {
  const [menProducts, setMenProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenProducts = async () => {
      try {
        const all = await getProducts();

        // نحاول نغطي الحالتين:
        // - الجندر = "Men"
        // - الكاتيجوري = "Men" (لو الباك بيستخدمها كده)
        const filtered = all.filter(
          (p) =>
            String(p.gender).toLowerCase() === "men" ||
            String(p.category).toLowerCase() === "men"
        );

        setMenProducts(filtered);
      } catch (err) {
        console.error("Failed to load men products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMenProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500">Loading products...</p>
        </div>
      </section>
    );
  }

  if (!menProducts || menProducts.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">
            Men’s Collection
          </h1>
          <p className="text-gray-600">
            No men’s products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Men’s Collection
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Explore our curated selection of men’s eyeglasses and sunglasses.
          </p>
        </div>

        {/* Grid of products */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {menProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              linkTo={`/products/${product.id}`}
              showAddToCart={true}  
              badge={null}         
            />
          ))}
        </div>
      </div>
    </section>
  );
}
