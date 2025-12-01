import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart, addToWishlist, getProducts } from "../api/productsApi";
import { toast } from "sonner";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products.find((p) => p.id == id);

        if (!found) {
          toast.error("Product not found");
          return;
        }

        // Colors from productImages, fallback to default if missing
        const uniqueColors = found.productImages
          ? [
              ...new Set(
                found.productImages.map((img) => img.color || "Default")
              ),
            ]
          : ["Default"];
        found.colors = uniqueColors;

        // Sizes fallback
        found.sizes =
          found.sizes && found.sizes.length > 0
            ? found.sizes
            : ["M", "L", "XL"];

        setProduct(found);

        // Auto-select first color that exists
        setSelectedColor(uniqueColors[0]);

        // Auto-select first size
        setSelectedSize(found.sizes[0]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-10 text-center">Loading...</p>;

  const handleAddToCart = async () => {
    if (!selectedColor) return toast.error("Select a color first");
    if (!selectedSize) return toast.error("Select a size first");

    try {
      await addToCart({
        ProductId: product.id,
        Color: selectedColor,
        Size: selectedSize,
        Quantity: quantity,
      });
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!selectedColor || !selectedSize) {
      return toast.error("Select color and size first");
    }
    try {
      await addToWishlist({
        ProductId: product.id,
        Color: selectedColor,
        Size: selectedSize,
      });
      toast.success("Added to wishlist ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT IMAGES */}
      <div>
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          {product.images?.length > 0 && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-[450px] object-cover"
            />
          )}
        </div>

        {/* COLORS */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-3 mt-4">
            {product.colors.map((color, index) => (
              <button
                key={color + index}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-primary scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          {product.description}
        </p>
        <p className="mt-4 text-4xl font-extrabold text-primary">
          {product.price} EGP
        </p>

        {/* SIZE SELECTOR */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-2">Size</p>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedSize === size
                      ? "bg-primary text-black border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUANTITY */}
        <div className="mt-6">
          <p className="text-gray-700 font-medium mb-2">Quantity</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              -
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>

          <button
            onClick={handleAddToWishlist}
            className="px-5 bg-red-100 text-red-600 rounded-xl flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
