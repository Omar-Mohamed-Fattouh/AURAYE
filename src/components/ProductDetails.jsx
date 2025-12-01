// ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      const data = response.data;

      // تحقق من وجود المنتج
      if (!data || data.length === 0) {
        setError("Product not found.");
        setProduct(null);
      } else {
        setProduct(data[0]); // تأكد من وجود العنصر الأول
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-details">
      <h1>{product?.name || "Unnamed Product"}</h1>
      <p>{product?.description || "No description available."}</p>

      {product?.images?.length > 0 ? (
        <div className="product-images">
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt={product.name} />
          ))}
        </div>
      ) : (
        <p>No images available.</p>
      )}

      <p>Price: ${product?.price ?? "N/A"}</p>

      {/* زر Stripe Checkout (تأكد من HTTPS في الإنتاج) */}
      <button
        onClick={() => {
          if (typeof window.Stripe === "undefined") {
            alert("Stripe.js is not loaded.");
            return;
          }
          // هنا تضيف كود الدفع الخاص بـ Stripe
          console.log("Proceed to Stripe checkout");
        }}
      >
        Buy Now
      </button>
    </div>
  );
}
