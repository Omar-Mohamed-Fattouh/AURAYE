import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ScanFace,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const productFromNav = location.state?.product || null;git pull origin main


  const [selectedColor, setSelectedColor] = useState("");
  const [selectedThumb, setSelectedThumb] = useState(0);

  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const [colorGroups, setColorGroups] = useState({});
  const [colorNames, setColorNames] = useState([]);

  const scrollRef = useRef(null);
  const BASE_URL = "http://graduation-project1.runasp.net";

  // تحميل كل المنتجات من الـ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/Api/products`);
        const data = await res.json();

        const formatted = data.map((p) => {
          const images =
            p.productImages && p.productImages.length > 0
              ? p.productImages.map((img) => ({
                  url: `${BASE_URL}${img.imgUrl}`,
                  color: img.color,
                }))
              : [{ url: p.defaultImgUrl, color: "Default" }];

          const oldPrice = (p.price * 1.2).toFixed(2);

          return {
            id: p.productId,
            name: p.title,
            price: p.price,
            oldPrice,
            description: p.description,
            category: p.category ? p.category.name : "Other",
            gender: p.gender || "Unisex",
            shape: p.shape || "Square",
            image_url: images[0].url,
            images: images,
          };
        });

        setAllProducts(formatted);
      } catch (err) {
        console.log("Error loading products:", err);
      }
    };

    fetchData();
  }, []);

  // الحصول على المنتج النهائي
  const product =
    allProducts.find((p) => p.id === productFromNav?.id) || productFromNav;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Product not found
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // تجهيز الألوان والمجموعات بعد تحميل المنتج
  useEffect(() => {
    if (!product || !product.images) return;

    const groups = {};
    product.images.forEach((img) => {
      if (!groups[img.color]) groups[img.color] = [];
      groups[img.color].push(img.url);
    });

    const colors = Object.keys(groups);
    setColorGroups(groups);
    setColorNames(colors);
    setSelectedColor(colors[0]);
    setMainImage(groups[colors[0]][0]);
    setSelectedThumb(0);
  }, [product]);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Related Products
  useEffect(() => {
    if (allProducts.length && product) {
      const filtered = allProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 10);
      setRelatedProducts(filtered);
    }
  }, [allProducts, product]);

  // Scroll progress bar
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const scrolled = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(scrolled);
  };

  const scrollLeftBtn = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRightBtn = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  const displayedThumbnails = colorGroups[selectedColor] || [];

  // تحديث الصورة الكبيرة لما يتغير selectedThumb
  useEffect(() => {
    if (displayedThumbnails.length) {
      setMainImage(displayedThumbnails[selectedThumb]);
    }
  }, [selectedThumb, displayedThumbnails]);

  const zoomRef = useRef(null);

  const handleMouseMove = (e) => {
    const zoom = zoomRef.current;
    if (!zoom) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    zoom.style.left = `${x - zoom.offsetWidth / 2}px`;
    zoom.style.top = `${y - zoom.offsetHeight / 2}px`;
    zoom.style.backgroundPosition = `${(x / width) * 100}% ${
      (y / height) * 100
    }%`;
    zoom.style.opacity = 1;
  };

  const handleMouseLeave = () => {
    if (zoomRef.current) zoomRef.current.style.opacity = 0;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 🔹 Add to Cart مع التحقق من login والمقاس
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // تحويل للصفحة login
        return;
      }

      if (!selectedSize) {
        alert("Please select a size before adding to cart!");
        return;
      }

      const res = await fetch(
        "https://graduation-project1.runasp.net/Api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            color: selectedColor,
            size: selectedSize,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        console.log("Failed:", errData);
        alert(errData.message || "Failed to add product to cart.");
        return;
      }

      const data = await res.json();
      console.log("Added:", data);
      alert("Product added to cart!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500 flex gap-1 dark:bg-gray-800 p-3 rounded-lg">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link to="/product" className="hover:underline">
            Products
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
        {/* LEFT IMAGES */}
        <div className="flex flex-col gap-4 p-4">
          <div className="relative">
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div
                ref={zoomRef}
                className="absolute w-42 h-42 rounded-full border-2 border-gray-300/50 pointer-events-none opacity-0 transition-opacity"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "550%",
                }}
              ></div>
            </div>

            <button
              onClick={() =>
                setSelectedThumb((prev) =>
                  prev === 0 ? displayedThumbnails.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              &#8592;
            </button>
            <button
              onClick={() =>
                setSelectedThumb((prev) =>
                  prev === displayedThumbnails.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              &#8594;
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            {displayedThumbnails.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                onClick={() => {
                  setMainImage(img);
                  setSelectedThumb(idx);
                }}
                className={`w-full h-20 object-cover rounded-lg cursor-pointer transition hover:opacity-80
          ${selectedThumb === idx ? "ring-2 ring-blue-600 scale-105" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="flex flex-col gap-6 mt-8 lg:mt-0">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-gray-900">{product.name}</h1>
            <span className="inline-block bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full w-max">
              {product.category}
            </span>
          </div>

          <p className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold text-gray-900">
              {product.price}.00 EGP
            </span>
            <span className="inline-block text-red-800 text-base font-semibold px-2 py-1 line-through w-max">
              {product.oldPrice} EGP
            </span>
          </p>

          <div className="border-t border-double border-gray-300 "></div>

          <div className="leading-tight">
            <p className="font-bold mb-2">Description</p>
            <p className="text-sm leading-snug mt-0">{product.description}</p>
          </div>

          <div className="flex gap-8">
            {/* Colors */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold">
                <span className="text-gray-400">Color:</span> {selectedColor}
              </p>
              <div className="flex gap-3">
                {colorNames.map((colorName, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColor(colorName);
                      setSelectedThumb(0);
                      setMainImage(colorGroups[colorName][0]);
                    }}
                    style={{ backgroundColor: colorName.toLowerCase() }}
                    className={`w-14 rounded-full h-8 transition border cursor-pointer flex items-center justify-center ${
                      selectedColor === colorName
                        ? "ring-2 ring-blue-600 scale-105"
                        : ""
                    }`}
                    title={colorName}
                  ></button>
                ))}
              </div>
            </div>

            <div className="border-l border-gray-300/50"></div>

            {/* Sizes */}
            <div className="flex flex-col gap-3 mt-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">
                  <span className="text-gray-400">Size:</span>{" "}
                  {selectedSize || "Select Size"}
                </p>
                <button className="text-gray-400 text-sm underline ml-5">
                  View Size Guide
                </button>
              </div>
              <div className="flex gap-3">
                {["S", "M", "L"].map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 rounded-full h-8 transition border cursor-pointer flex items-center justify-center ${
                      selectedSize === size
                        ? "ring-2 ring-blue-600 scale-105"
                        : "border-gray-300"
                    }`}
                    title={size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mt-6 flex items-center gap-3">
            <span className="font-semibold text-base">Quantity</span>
            <div className="flex items-center bg-gray-100  rounded-lg">
              <button
                onClick={decreaseQty}
                className="cursor-pointer px-3 py-1.5 text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg"
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center text-base font-semibold bg-transparent"
              />
              <button
                onClick={increaseQty}
                className="cursor-pointer px-3 py-1.5 text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3 mt-4">
            <button
              onClick={addToCart}
              className="flex-1 py-4 bg-[#0a192f] text-white rounded-lg flex items-center justify-center gap-3"
            >
              <ShoppingCart /> Add to Cart
            </button>

            <button className="flex-1 py-4 bg-[#e9ecef] text-primary rounded-lg flex items-center justify-center gap-3">
              <ScanFace /> Try in AR
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 relative">
          <h2 className="text-3xl font-bold mb-6">You Might Also Like</h2>
          <button
            onClick={scrollLeftBtn}
            className="absolute -left-12 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-3 rounded-full z-10"
          >
            <ChevronLeft />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto py-4 scroll-smooth"
          >
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[300px] bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 left-2 z-10 p-2 rounded-full bg-white flex items-center justify-center hover:bg-white/80 transition cursor-pointer"
                  >
                    <Heart
                      size={20}
                      className={
                        favorites.includes(product.id)
                          ? "text-red-600"
                          : "text-black"
                      }
                      fill={
                        favorites.includes(product.id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    state={{ product }}
                    className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition bg-black/40"
                  >
                    View Details
                  </Link>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 truncate">
                    {product.description}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-block bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full w-max">
                      {product.category}
                    </span>
                    <span className="inline-block bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full w-max">
                      Large
                    </span>
                  </div>
                  <p className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price}.00 EGP
                    </span>
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full line-through w-max">
                      {product.oldPrice} EGP
                    </span>
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                      <ShoppingCart size={16} /> Add
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white hover:brightness-90 transition cursor-pointer"
                      style={{ backgroundColor: "#2169e4" }}
                    >
                      <ScanFace size={16} /> Try
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={scrollRightBtn}
            className="absolute -right-12 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-3 rounded-full z-10"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
