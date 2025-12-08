// ProductCard.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "../api/productsApi";
import { CartContext } from "../store/cartContext";

export default function ProductCard({
  product,
  linkTo,
  showAddToCart = false, // Deals: true | Related: false
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { refreshCounts } = useContext(CartContext);

  // ✅ Sync wishlist state on mount / refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!product?.id || !token) {
      setIsWishlisted(false);
      return;
    }

    async function checkWishlist() {
      try {
        const res = await isProductInWishlist(product.id);
        const data = res.data;

        if (
          data === true ||
          data === "true" ||
          (typeof data === "object" && data?.exists === true)
        ) {
          setIsWishlisted(true);
        } else {
          setIsWishlisted(false);
        }
      } catch (err) {
        console.error("Wishlist check failed:", err);
      }
    }

    checkWishlist();
  }, [product?.id]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // عشان ما يفتحش اللينك لما تدوسي على القلب

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in to use the wishlist.");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success("Product removed from wishlist.");
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success("Product added to wishlist.");
      }

      // ✅ حدّث عدادات الـ Navbar (wishlist + cart لو backend بيأثر عليهم)
      if (typeof refreshCounts === "function") {
        await refreshCounts();
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data;

      if (
        !isWishlisted &&
        err.response?.status === 400 &&
        typeof msg === "string" &&
        msg.toLowerCase().includes("already exists in wishlist")
      ) {
        setIsWishlisted(true);
        toast.info("Product is already in your wishlist.");
        return;
      }

      if (err.response?.status === 401) {
        toast.error("You need to log in to use the wishlist.");
      } else {
        toast.error("Failed to update wishlist.");
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!showAddToCart) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
      toast.success("Product added to cart.");

      // ✅ نحدّث عداد الكارت في الـ Navbar فورًا
      if (typeof refreshCounts === "function") {
        await refreshCounts();
      }
    } catch (err) {
      console.error("Cart error:", err);
      const msg = err.response?.data;

      if (
        err.response?.status === 400 &&
        typeof msg === "string" &&
        msg.toLowerCase().includes("already")
      ) {
        toast.info("This product is already in your cart.");
      } else if (err.response?.status === 401) {
        toast.error("You need to log in to add items to the cart.");
      } else {
        toast.error("Failed to add product to cart.");
      }
    }
  };

  // ألوان من الصور
  const colors = Array.from(
    new Set(
      (product.images || [])
        .map((img) => img.color)
        .filter(Boolean)
    )
  );

  const hasDiscount =
    product.oldPrice && Number(product.oldPrice) > Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100
      )
    : 0;
const description = product.description.length > 120 ? product.description.slice(0, 120) + "..." : product.description;
  return (
    <Link
      to={linkTo}
      className="
        bg-white transition p-4 relative 
        flex flex-col 
        h-[360px] 
        rounded-xl  
      "
    >
      {/* Wishlist button */}
      <button
        className="absolute top-3 right-3 hover:bg-gray-200 transition duration-500 p-2 rounded-full z-10"
        onClick={handleToggleWishlist}
      >
        <Heart
          size={22}
          className={isWishlisted ? "text-red-500" : "text-gray-700"}
          fill={isWishlisted ? "red" : "none"}
        />
      </button>

      {/* Image */}
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-36 object-contain mb-4"
      />

      {/* Product Title */}
      <h3 className="font-bold text-gray-900 text-sm uppercase h-[38px] overflow-hidden">
        {product.name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-xs h-[36px] overflow-hidden">
        {description || "High-quality eyeglasses for everyday use."}
      </p>

      {/* Prices */}
      <div className="flex items-center gap-2 mt-2">
        {hasDiscount && (
          <span className="line-through text-gray-400 text-sm">
            EGP {Number(product.oldPrice).toLocaleString()}
          </span>
        )}

        <span className="text-red-600 font-bold text-base">
          EGP {Number(product.price).toLocaleString()}
        </span>

        {hasDiscount && (
          <span className="text-red-600 text-sm font-semibold">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Colors */}
      <div className="flex items-center gap-1 mt-1">
        {colors.slice(0, 3).map((c, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: c }}
          ></span>
        ))}

        {colors.length > 3 && (
          <span className="text-gray-500 text-xs ml-1">
            +{colors.length - 3}
          </span>
        )}
      </div>

      {/* Add to Cart (اختياري) */}
      {showAddToCart && (
        <button
          onClick={handleAddToCart}
          className="mt-3 flex items-center justify-center gap-2 text-sm bg-black text-white py-2 px-3 rounded-md hover:opacity-90"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      )}
    </Link>
  );
}
