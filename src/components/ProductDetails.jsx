// ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts, addToCart, addToWishlist } from "../api/productsApi";
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

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
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

        const found =
          products.find((p) => Number(p.id) === Number(id)) || products[0];

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
  }, [id]);

  // All images
  const allImages = useMemo(() => {
    if (!product || !product.images) return [];
    return product.images;
  }, [product]);

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
    if (!oldp || oldp >= p) return 0;
    return ((p - oldp) / p) * 100;
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

  // Small helper to map color names to hex (fallback to a neutral color)
  function getColorHex(colorName) {
    if (!colorName) return "#e5e7eb";
    const key = colorName.toLowerCase();
    const map = {
      black: "#000000",
      gold: "#d4af37",
      "pale gold": "#e7d3a3",
      silver: "#c0c0c0",
      "rose gold": "#e8c1b5",
      brown: "#5b4636",
      tortoise: "#5a3b2e",
    };
    return map[key] || "#e5e7eb";
  }

  async function handleAddToCart() {
    if (!product) return;

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

    console.log(localStorage.getItem("token"));
    console.log("PAYLOAD:", payload);
    try {
      await addToCart(payload);
      toast.success("Product added to cart.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart.");
    }
  }

  async function handleAddToWishlist() {
    if (!product) return;
    try {
      await addToWishlist(product.productId);
      toast.success("Product added to wishlist.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to wishlist.");
    }
  }

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

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

            {/* Price block */}
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  {/* Current price */}
                  <div className="text-2xl font-extrabold text-red-600">
                    {formatEGP(product.oldPrice)}
                  </div>

                  {/* Old price + discount */}
                  {product.oldPrice &&
                    Number(product.oldPrice) < Number(product.price) && (
                      <>
                        <div className="text-sm text-gray-400 line-through">
                          {formatEGP(product.price)}
                        </div>

                        <div className="text-sm text-green-600 font-medium">
                          {discountPercent.toFixed(0)}%
                        </div>
                      </>
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
                        ? "border-black ring-2 ring-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: getColorHex(color) }}
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
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-95"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="bg-white p-2 mb-1 rounded-full shadow-md border border-gray-200 flex items-center justify-center"
                >
                  <Heart
                    size={20}
                  className={product.productId ? "text-red-500" : "text-gray-700"}
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
