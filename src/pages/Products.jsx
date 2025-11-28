import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productsApi.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { Loader2 } from "lucide-react";

const Products = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  
const BASE_URL = "http://graduation-project1.runasp.net";

    console.log(products?.[0]?.productImages?.[0]?.imageUrl);
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent py-24 overflow-hidden">
        <div className="container mx-auto text-center text-black relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to ShopFlow
          </h1>
          <p className="text-xl md:text-2xl opacity-90 drop-shadow">
            Discover premium products at amazing prices
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
      </section>

      {/* Products Section */}
      <main className="container mx-auto py-16">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-gray-500 text-lg">Loading amazing products...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <p className="text-red-500 text-lg font-semibold">
                Failed to load products
              </p>
            </div>
          </div>
        )}

        {products && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
