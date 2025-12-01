import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { addToCart } from "../api/productsApi";

export const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null
  );

  const FALLBACK_IMAGE = "/fallback.png";

  const imageSrc =
    product.defaultImgUrl && product.defaultImgUrl.startsWith("https")
      ? product.defaultImgUrl
      : product.defaultImgUrl
      ? product.defaultImgUrl
      : FALLBACK_IMAGE;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("This product has no available colors");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
      });

      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="group rounded-2xl bg-white border shadow-sm hover:shadow-xl transition-all duration-300 p-4 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        />
      </div>

      {/* Info */}
      <div className="pt-5">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <p className="mt-3 text-2xl font-bold text-primary">
          ${Number(product.price || 0).toFixed(2)}
        </p>

        {/* Size Selector */}
        {product.sizes?.length > 0 && (
          <div className="mt-3 flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-lg border text-sm transition-all
                  ${
                    selectedSize === size
                      ? "bg-primary text-black font-semibold"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Color Selector */}
        {product.colors?.length > 0 && (
          <div className="mt-3 flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all
                  ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-gray-300"
                  }
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-primary text-black py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.96] transition-all disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};
