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
import { AuthContext } from "../features/auth/AuthContext";

export default function ProductCard({
  product,
  linkTo,
  showAddToCart = false,
  onTryOn,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { refreshCounts } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);

  // ✅ Check wishlist only if logged in
  useEffect(() => {
    if (!product?.id || !isLoggedIn) {
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
        setIsWishlisted(false);
      }
    }

    checkWishlist();
  }, [product?.id, isLoggedIn]);

  // ✅ Toggle Wishlist
  const handleToggleWishlist = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
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

      // ✅ تحديث العداد في الـ Navbar فورًا
      if (typeof refreshCounts === "function") {
        await refreshCounts();
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to update wishlist.");
      }
    }
  };

  // ✅ Add To Cart
  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!showAddToCart) return;

    if (!isLoggedIn) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });

      toast.success("Product added to cart.");

      // ✅ تحديث عداد الكارت فورًا
      if (typeof refreshCounts === "function") {
        await refreshCounts();
      }
    } catch (err) {
      console.error("Cart error:", err);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to add product to cart.");
      }
    }
  };

  // ✅ Colors
const colors = product.availableColors || [];


  const hasDiscount =
    product.oldPrice && Number(product.oldPrice) > Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100
      )
    : 0;

  return (
    <>
    <Link
      to={linkTo}
      className="
      bg-white transition p-4 relative 
        flex flex-col 
        h-[360px] 
        rounded-xl  
      "
      >
      {/* ✅ Wishlist Button */}
      <button
        className="absolute top-3 right-3 hover:bg-gray-200 transition p-2 rounded-full z-10"
        onClick={handleToggleWishlist}
      >
        <Heart
          size={22}
          className={isWishlisted ? "text-red-500" : "text-gray-700"}
          fill={isWishlisted ? "red" : "none"}
        />
      </button>

      {/* ✅ Image */}
      <img
        src={product.images?.[0]?.url}
        alt={product.name}
        className="w-full h-36 object-contain mb-4"
      />

      {/* ✅ Product Name */}
      <h3 className="font-bold text-gray-900 text-sm uppercase h-[38px] overflow-hidden">
        {product.name}
      </h3>

      {/* ✅ Description */}
      <p className="text-gray-600 text-xs h-[36px] overflow-hidden">
        {product.description || "High-quality eyeglasses for everyday use."}
      </p>

      {/* ✅ Price */}
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

      {/* ✅ Colors */}
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

      {/* ✅ Add To Cart */}
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

      {/* ✅ Try-On Button */}
      {onTryOn && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onTryOn(product);
          }}
          className="mt-2 flex items-center justify-center text-sm border border-black text-black py-2 px-3 rounded-md hover:bg-black hover:text-white transition"
        >
          جرّبها افتراضياً
        </button>
      )}

            </>
  );
}
