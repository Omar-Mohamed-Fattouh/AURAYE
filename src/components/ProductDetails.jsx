import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart, addToWishlist, getProducts } from "../api/productsApi";
import { toast } from "sonner";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams(); // product id from URL
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const FALLBACK_IMAGE = "/fallback.png";

  /* ---------------------- FETCH PRODUCT ---------------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products.find((p) => p.id == id);
        setProduct(found);

        // auto select first color
        if (found?.colors?.length > 0) {
          setSelectedColor(found.colors[0]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-10 text-center">Loading...</p>;

  /* ---------------------- HANDLE ADD TO CART ---------------------- */
  const handleAddToCart = async () => {
    if (!selectedColor) {
      toast.error("Select a color first");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        color: selectedColor,
        quantity,
      });

      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  /* ---------------------- HANDLE ADD TO WISHLIST ---------------------- */
  const handleAddToWishlist = async () => {
    try {
      await addToWishlist({
        productId: product.id,
        color: selectedColor,
      });

      toast.success("Added to wishlist ❤️");
    } catch (err) {
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT COLUMN - IMAGES */}
      <div>
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={product.image_url || FALLBACK_IMAGE}
            alt={product.name}
            className="w-full h-[450px] object-cover"
          />
        </div>

        {/* COLORS THUMBNAILS */}
        {product.colors?.length > 0 && (
          <div className="flex gap-3 mt-4">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all 
                  ${
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

      {/* RIGHT COLUMN - DETAILS */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        <p className="mt-3 text-gray-600 leading-relaxed">
          {product.description}
        </p>

        <p className="mt-4 text-4xl font-extrabold text-primary">
          ${Number(product.price).toFixed(2)}
        </p>

        {/* Quantity */}
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

        {/* Buttons */}
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
