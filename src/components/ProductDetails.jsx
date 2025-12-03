// ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProducts,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "../api/productsApi";
import { toast } from "sonner";
import {
  Heart,
  ShoppingCart,
  Eye,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams(); // product id from route
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    details: false,
    shipping: false,
    frame: false,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchProduct() {
      try {
        setLoading(true);
        const products = await getProducts();
        if (!mounted) return;

        const found = products.find((p) => Number(p.id) === Number(id));

        // لو الـ id مش موجود → روح لـ NotFoundPage
        if (!found) {
          navigate("/NotFoundPage", { replace: true });
          return;
        }

        setProduct(found);

        // build colors list from images
        const colors = Array.from(
          new Set(
            (found.images || []).map((img) =>
              img.color ? img.color.trim() : "Default"
            )
          )
        );

        setAvailableColors(colors);
        setSelectedColor((prev) => prev || colors[0] || "Default");
        setMainImageIndex(0);
        setQuantity(1);
        setSelectedSize("");
        setIsWishlisted(false); // بدايةً false (لو حابة نجيب من الباك بعدين نعملها)
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  // Images filtered by selected color
  const galleryImages = useMemo(() => {
    if (!product || !product.images) return [];
    if (!selectedColor) return product.images;

    const filtered = product.images.filter(
      (img) =>
        (img.color ? img.color.trim() : "Default") ===
        (selectedColor ? selectedColor.trim() : "Default")
    );

    return filtered.length > 0 ? filtered : product.images;
  }, [product, selectedColor]);

  // Main image url with fallback
  const mainImageUrl = useMemo(() => {
    if (!product) return "";

    if (galleryImages.length > 0) {
      const idx = Math.min(mainImageIndex, galleryImages.length - 1);
      return galleryImages[idx]?.url || "";
    }

    if (product.defaultImgUrl) {
      if (product.defaultImgUrl.startsWith("http")) {
        return product.defaultImgUrl;
      }
      if (product.images && product.images[0]?.url) {
        return product.images[0].url;
      }
      return product.defaultImgUrl;
    }

    return product.images && product.images[0]?.url
      ? product.images[0].url
      : "";
  }, [product, galleryImages, mainImageIndex]);

  function formatEGP(value) {
    try {
      return new Intl.NumberFormat("en-EG", {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `EGP ${Number(value).toFixed(2)}`;
    }
  }

  const discountPercent = useMemo(() => {
    if (!product || !product.oldPrice) return 0;
    const oldp = Number(product.oldPrice);
    const p = Number(product.price);
    if (!oldp || oldp <= p) return 0;
    return ((oldp - p) / oldp) * 100;
  }, [product]);

  function toggleAccordion(key) {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function changeQuantity(delta) {
    if (!product) return;
    const next = quantity + delta;
    if (next < 1) return;
    if (next > product.stockQuantity) {
      toast.error("Selected quantity exceeds available stock.");
      return;
    }
    setQuantity(next);
  }

  function onSelectColor(color) {
    setSelectedColor(color);
    setMainImageIndex(0);
  }

  // colors directly from backend
  function getColorValue(colorValue) {
    if (!colorValue) return "#e5e7eb";
    return colorValue; // backend value (CSS name or hex)
  }

  async function handleAddToCart() {
    if (!product) return;

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    // ⛔ ممنوع يضيف لو مش عامل login
    if (!isLoggedIn) {
      toast.error("You need to log in to add items to the cart.");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity.");
      return;
    }

    const payload = {
      productId: Number(product.id),
      color: selectedColor,
      quantity,
      size: selectedSize || "",
    };

    try {
      await addToCart(payload);
      toast.success("Product added to cart.");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data;

      if (err.response?.status === 401) {
        toast.error("You need to log in to add items to the cart.");
      } else if (
        err.response?.status === 400 &&
        typeof msg === "string" &&
        msg.toLowerCase().includes("already")
      ) {
        toast.info("This product is already in your cart.");
      } else {
        toast.error("Failed to add product to cart.");
      }
    }
  }

  async function handleToggleWishlist() {
  if (!product) return;

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You need to log in to use the wishlist.");
    return;
  }

  try {
    if (isWishlisted) {
      // remove from wishlist
      await removeFromWishlist(Number(product.id));
      setIsWishlisted(false);
      toast.success("Product removed from wishlist.");
    } else {
      // add to wishlist
      await addToWishlist(Number(product.id));
      setIsWishlisted(true);
      toast.success("Product added to wishlist.");
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
}

  useEffect(() => {
    const token = localStorage.getItem("token");

    // لو مفيش product لسه أو مفيش login → skip
    if (!product || !product.id || !token) {
      setIsWishlisted(false);
      return;
    }

    async function checkWishlist() {
      try {
        const res = await isProductInWishlist(Number(product.id));

        // API احتمال يرجّع true أو object → دعمنا كل الحالات
        if (
          res.data === true ||
          res.data === "true" ||
          res.data?.exists === true
        ) {
          setIsWishlisted(true);
        } else {
          setIsWishlisted(false);
        }
      } catch (err) {
        console.error("Failed wishlist check:", err);
      }
    }

    checkWishlist();
  }, [product]);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Gallery (images) */}
        <div className="lg:col-span-7">
          <div className="flex gap-4">
            {/* Desktop / tablet vertical thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-24">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={`w-full h-20 p-2 rounded-md overflow-hidden flex items-center justify-center border ${
                    idx === mainImageIndex
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - ${img.color || "image"}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-white">
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </div>
          </div>

          {/* Mobile thumbnails (horizontal) */}
          {galleryImages.length > 1 && (
            <div className="mt-4 flex gap-3 md:hidden overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 p-2 rounded-md overflow-hidden flex items-center justify-center border ${
                    idx === mainImageIndex
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} - ${img.color || "image"}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="lg:col-span-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="text-sm text-gray-500 mt-1">
                {product.category} • {product.shape} • {product.gender}
              </div>
            </div>

            {/* Price block (سيبيه زي ما هو عندك لو حابة تغيريه بعدين) */}
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  {product.oldPrice &&
                  Number(product.oldPrice) > Number(product.price) ? (
                    <>
                      <div className="text-2xl font-extrabold text-red-600">
                        {formatEGP(product.price)}
                      </div>
                      <div className="text-sm text-gray-400 line-through">
                        {formatEGP(product.oldPrice)}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {discountPercent.toFixed(0)}%
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-extrabold text-black">
                      {formatEGP(product.price)}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400">Incl VAT</div>
              </div>

              {/* stock label */}
              <div className="ml-auto text-sm">
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600">In stock</span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </div>
            </div>

            {/* Color selector */}
            <div>
              <div className="text-sm font-medium mb-2">Color</div>
              <div className="flex gap-3 items-center flex-wrap">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onSelectColor(color)}
                    className={`relative w-8 h-8 rounded-full border flex items-center justify-center ${
                      selectedColor === color
                        ? "border-2 border-gray-900"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: getColorValue(color) }}
                    aria-label={color}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">
                  Select Fit / Size
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-2 border rounded-md text-sm ${
                        selectedSize === s
                          ? "border-black font-semibold"
                          : "border-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1">
                <button
                  onClick={() => changeQuantity(-1)}
                  className="p-1"
                  aria-label="decrease"
                >
                  <Minus size={16} />
                </button>
                <div className="px-3 text-sm">{quantity}</div>
                <button
                  onClick={() => changeQuantity(+1)}
                  className="p-1"
                  aria-label="increase"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 flex gap-2">
                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                    !isLoggedIn || product.stockQuantity <= 0
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-black text-white hover:opacity-95"
                  }`}
                  disabled={!isLoggedIn || product.stockQuantity <= 0}
                >
                  <ShoppingCart size={18} />
                  {!isLoggedIn
                    ? "Log in to add"
                    : product.stockQuantity <= 0
                    ? "Out of stock"
                    : "Add to Cart"}
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={handleToggleWishlist}
                  className={`bg-white p-2 mb-1 rounded-full shadow-md border flex items-center justify-center ${
                    isWishlisted ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? "text-red-500" : "text-gray-700"}
                    fill={isWishlisted ? "red" : "none"}
                  />
                </button>
              </div>
            </div>

            {/* Try On AR */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toast("Try On AR - placeholder UI")}
                className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-md"
              >
                <Eye size={16} />
                Try On AR
              </button>
              <div className="text-xs text-gray-500">
                Preview using AR (UI placeholder)
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-2">
              {/* Description accordion (open by default) */}
              <Accordion
                title="Description"
                isOpen={openAccordions.description}
                onToggle={() => toggleAccordion("description")}
              >
                <div className="text-sm text-gray-700">
                  {product.description || "No description available."}
                </div>
              </Accordion>

              <Accordion
                title="Product Details"
                isOpen={openAccordions.details}
                onToggle={() => toggleAccordion("details")}
              >
                <ul className="list-disc pl-5 text-sm">
                  <li>Material: {product.frameMaterial || "—"}</li>
                  <li>Shape: {product.shape || "—"}</li>
                  <li>Gender: {product.gender || "—"}</li>
                  <li>SKU: {product.id}</li>
                </ul>
              </Accordion>

              <Accordion
                title="Shipping & Returns"
                isOpen={openAccordions.shipping}
                onToggle={() => toggleAccordion("shipping")}
              >
                <div className="text-sm">
                  Customized eyeglasses cannot be exchanged or returned.
                  Standard shipping in 3–7 working days.
                </div>
              </Accordion>

              <Accordion
                title="Frame Info"
                isOpen={openAccordions.frame}
                onToggle={() => toggleAccordion("frame")}
              >
                <div className="text-sm">
                  {product.frameMaterial
                    ? `Material: ${product.frameMaterial}`
                    : "Details not available."}
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Simple Accordion subcomponent */
function Accordion({ title, children, isOpen = false, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white"
      >
        <div className="font-medium">{title}</div>
        <ChevronDown
          size={18}
          className={`transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && <div className="px-4 py-3 bg-gray-50">{children}</div>}
    </div>
  );
}
