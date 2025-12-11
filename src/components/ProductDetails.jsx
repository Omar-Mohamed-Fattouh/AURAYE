// src/pages/ProductDetails.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  Suspense,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext";
import { CartContext } from "../store/cartContext";
import { addToCart } from "../api/productsApi";
import {
  getProductById,
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

// AR imports
import { Canvas } from "@react-three/fiber";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera as MP_Camera } from "@mediapipe/camera_utils";

// Face tracking constants (لنظارة الصفرا)
const MIN_EYE_DIST = 0.06;
const MAX_EYE_DIST = 0.25;
const Y_OFFSET = 0.02;
const REF_EYE_DIST = 0.12; // reference for scaling

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { refreshCounts } = useContext(CartContext);
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setIsLoggedIn]);

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

  // 🔹 AR Try-On modal
  const [showTryOn, setShowTryOn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchProduct() {
      try {
        setLoading(true);
        const found = await getProductById(id);
        if (!mounted) return;

        if (!found) {
          navigate("/NotFoundPage", { replace: true });
          return;
        }

        setProduct(found);

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
        setIsWishlisted(false);
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

  function getColorValue(colorValue) {
    if (!colorValue) return "#e5e7eb";
    return colorValue;
  }

  async function handleAddToCart() {
    if (!product) return;

    const token = localStorage.getItem("token");
    const loggedIn = !!token;

    if (!loggedIn) {
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

      if (typeof refreshCounts === "function") {
        await refreshCounts();
      }
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
        await removeFromWishlist(Number(product.id));
        setIsWishlisted(false);
        toast.success("Product removed from wishlist.");
      } else {
        await addToWishlist(Number(product.id));
        setIsWishlisted(true);
        toast.success("Product added to wishlist.");
      }

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
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!product || !product.id || !token) {
      setIsWishlisted(false);
      return;
    }

    async function checkWishlist() {
      try {
        const res = await isProductInWishlist(Number(product.id));
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

  // 🔹 Open AR Try-On with confirm dialog
  const handleOpenTryOn = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera is not supported on this device.");
      return;
    }

    const ok = window.confirm(
      "To use AR Try-On, we need to access your camera. Do you want to continue?"
    );
    if (!ok) return;

    setShowTryOn(true);
  };

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex gap-4">
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
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center p-4 border border-gray-200  bg-white">
                  <img
                    src={mainImageUrl}
                    alt={product.name}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
              </div>
            </div>
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

          <div className="lg:col-span-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  {product.category} • {product.shape} • {product.gender}
                </div>
              </div>

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

                <div className="ml-auto text-sm">
                  {product.stockQuantity > 0 ? (
                    <span className="text-green-600">In stock</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </div>
              </div>

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

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenTryOn}
                  className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-md"
                >
                  <Eye size={16} />
                  Try On AR
                </button>
                <div className="text-xs text-gray-500">
                  Preview this frame using AR.
                </div>
              </div>

              <div className="space-y-2">
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

      {/* 🔹 AR Try-On Modal */}
      {showTryOn && <TryOnModal onClose={() => setShowTryOn(false)} />}
    </>
  );
}

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

/* ===================== AR Try-On Modal ===================== */
function TryOnModal({ onClose }) {
  const videoRef = useRef(null);

  const [glassesTransform, setGlassesTransform] = useState({
    position: [0, 0, 0],
    scale: 1,
    rotationZ: 0,
  });

  // 0 = Small, 1 = Medium, 2 = Large
  const [sizePreset, setSizePreset] = useState(1);
  const sizePresetRef = useRef(1);

  useEffect(() => {
    sizePresetRef.current = sizePreset;
  }, [sizePreset]);

  useEffect(() => {
    let mpCamera;
    let faceMesh;
    let running = true;

    const setupFaceMesh = async () => {
      if (!videoRef.current) return;

      faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      const onResults = (results) => {
        if (!running) return;
        if (!results.multiFaceLandmarks || !results.multiFaceLandmarks[0]) {
          return;
        }

        const landmarks = results.multiFaceLandmarks[0];

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const centerX = (leftEye.x + rightEye.x) / 2;
        const centerY = (leftEye.y + rightEye.y) / 2;

        const dx = rightEye.x - leftEye.x;
        const dy = rightEye.y - leftEye.y;

        const eyeDistRaw = Math.sqrt(dx * dx + dy * dy);
        const eyeDist = Math.min(
          MAX_EYE_DIST,
          Math.max(MIN_EYE_DIST, eyeDistRaw)
        );

        const angle = Math.atan2(dy, dx);

        // position mapping (زي القديمة تقريباً)
        const x = (centerX - 0.5) * 1.4;
        const y = -(centerY - 0.5) * 1.4 + Y_OFFSET;

        // base scale from face
        let baseScale = (eyeDist / REF_EYE_DIST) * 0.9;

        // small / medium / large
        const preset = sizePresetRef.current;
        let presetMul = 1;
        if (preset === 0) presetMul = 0.8; // small
        else if (preset === 2) presetMul = 1.25; // large
        else presetMul = 1.0; // medium

        let dynamicScale = baseScale * presetMul;
        dynamicScale = Math.min(2.5, Math.max(0.5, dynamicScale));

        // smoothing خفيف عشان الحركة تبان طبيعية
        setGlassesTransform((prev) => ({
          position: [
            prev.position[0] * 0.4 + x * 0.6,
            prev.position[1] * 0.4 + y * 0.6,
            0,
          ],
          scale: prev.scale * 0.4 + dynamicScale * 0.6,
          rotationZ: prev.rotationZ * 0.4 + -angle * 0.6,
        }));
      };

      faceMesh.onResults(onResults);

      try {
        mpCamera = new MP_Camera(videoRef.current, {
          onFrame: async () => {
            if (!running) return;
            try {
              await faceMesh.send({ image: videoRef.current });
            } catch (_) {}
          },
          width: 640,
          height: 480,
        });

        mpCamera.start();
      } catch (err) {
        console.error("Failed to start Mediapipe Camera:", err);
      }
    };

    setupFaceMesh();

    return () => {
      running = false;
      if (mpCamera) {
        try {
          mpCamera.stop();
        } catch (_) {}
      }
      if (faceMesh && faceMesh.close) {
        try {
          faceMesh.close();
        } catch (_) {}
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em]">
              AR TRY-ON
            </p>
            <h2 className="text-sm md:text-base font-semibold text-gray-900">
              Live camera preview
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        {/* Camera + overlay */}
        <div className="relative bg-black" style={{ aspectRatio: "4 / 3" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: "scaleX(-1)" }}
          >
            <Canvas
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
              }}
              camera={{ position: [0, 0, 2.5], fov: 35 }}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
                pointerEvents: "none",
              }}
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[2, 2, 3]} intensity={0.8} />

              {/* النظارة الصفرا القديمة */}
              <PlaceholderGlasses
                position={glassesTransform.position}
                scale={glassesTransform.scale}
                rotationZ={glassesTransform.rotationZ}
              />
            </Canvas>
          </div>
        </div>

        {/* Size presets */}
        <div className="px-4 pt-2 pb-1 bg-gray-50 border-t border-gray-200 text-[11px] text-gray-700">
          <div className="flex items-center justify-between gap-4">
            <span className="whitespace-nowrap font-medium">Frame size</span>

            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={sizePreset}
                onChange={(e) => setSizePreset(Number(e.target.value))}
                className="w-full accent-black"
              />
              <div className="flex justify-between text-[10px] uppercase tracking-[0.15em]">
                {["Small", "Medium", "Large"].map((label, idx) => (
                  <span
                    key={label}
                    className={
                      idx === sizePreset
                        ? "text-gray-900 font-semibold"
                        : "text-gray-400"
                    }
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="px-4 py-2 bg-white text-[11px] text-gray-500 flex justify-between items-center">
          <span>Tip: Look straight at the camera and move your head slowly.</span>
          <span className="hidden md:inline">
            Your camera runs locally in your browser.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ====== Yellow placeholder glasses (old style) ====== */
function PlaceholderGlasses({ position, scale, rotationZ }) {
  const s = scale * 0.8;
const frameColor = "#facc15";

return (
  <group   position={[position[0], position[1] - 0.03, position[2]]}
 rotation={[0, 0, rotationZ]} scale={[1, 1, 1]}>
    {/* left lens */}
    <mesh position={[-0.15 * s, 0, 0]}>
      <circleGeometry args={[0.10 * s, 32]} />
      <meshBasicMaterial color={frameColor} wireframe />
    </mesh>

    {/* right lens */}
    <mesh position={[0.15 * s, 0, 0]}>
      <circleGeometry args={[0.10 * s, 32]} />
      <meshBasicMaterial color={frameColor} wireframe />
    </mesh>

    {/* bridge */}
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.1 * s, 0.01 * s, 0.01]} />
      <meshBasicMaterial color={frameColor} />
    </mesh>
  </group>
);

}
