import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "../api/productsApi";

export const ProductCard = ({ product }) => {
  console.log("Product received:", product);

  const BASE_URL = "http://graduation-project1.runasp.net";

  const handleAddToCart = async () => {
    const chosenColor = product.colors?.[0] || null;

    if (!chosenColor) {
      toast.error("This product has no available colors.");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        color: chosenColor,
        quantity: 1,
      });

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  // الصورة تكون دايمًا من image_url
  const imageSrc = product.image_url?.startsWith("http")
    ? product.image_url
    : `${BASE_URL}${product.image_url}`;

  return (
    <div className="group rounded-2xl bg-gray-100 border shadow-sm hover:shadow-xl transition-all duration-300 p-4">
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-10">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="pt-5">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <p className="mt-3 text-2xl font-bold text-primary">
          ${Number(product.price || 0).toFixed(2)}
        </p>

        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-primary text-black py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
