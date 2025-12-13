import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { createOrUpdateReview } from "../api/productsApi";

export default function ProductReviews({ reviews = [], productId, user }) {
  const [userReview, setUserReview] = useState(null);
  const [reviewsWithUser, setReviewsWithUser] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Directly use API-provided userName and userImage
  useEffect(() => {
    setReviewsWithUser(reviews);
  }, [reviews]);

  useEffect(() => {
    if (!user) return;
    const found = reviews.find((r) => r.userId === user.userId);
    setUserReview(found || null);
    setText(found?.comment || "");
    setRating(found?.rating || 5);
  }, [reviews, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to submit a review.");

    try {
      setLoading(true);

      await createOrUpdateReview(
        productId,
        { rating, comment: text },
        userReview?.reviewId
      );

      alert("Review saved successfully.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error saving review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-14 bg-white border-t border-black/10">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">
          Customer Reviews
        </h2>

        {reviewsWithUser.length > 0 ? (
          <div className="relative overflow-visible">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onSwiper={(swiper) => {
                setTimeout(() => {
                  if (swiper.params.navigation) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                });
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              loop={true}
              className="relative px-8"
            >
              {reviewsWithUser.map((r) => (
                <SwiperSlide key={r.reviewId} className="p-4">
                  <div className="border border-white rounded-2xl p-6 bg-white text-black border-2 border-black h-[200px] flex flex-col transition-colors duration-700 hover:black hover:white">
                    {/* User Info */}
                    <div className="flex items-center mb-4 gap-3">
                      {r.userImage ? (
                        <img
                          src={
                            "https://graduationproject11.runasp.net/" +
                            r.userImage
                          }
                          alt={r.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:text-black">
                          {r.userName?.charAt(0) || "U"}
                        </div>
                      )}
                      <p className="font-semibold text-lg">{r.userName}</p>
                    </div>

                    {/* Stars */}
                    <div className="flex text-yellow-400 text-xl mb-2">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>

                    {/* Comment */}
                    <p className="text-md flex-1 overflow-hidden mb-2">
                      {r.comment}
                    </p>

                    {/* Date */}
                    <p className="text-gray-400 text-sm mt-auto">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p className="text-gray-500 mb-10 text-center">No reviews yet.</p>
        )}

        {/* Review Form */}
        <div className="mt-12 border border-black rounded-xl p-6 bg-white">
          <h3 className="text-xl font-semibold text-black mb-4">
            {userReview ? "Edit Your Review" : "Add Your Review"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1 text-black">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-black rounded-md px-3 py-2 text-sm bg-white"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Stars
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-black">Review</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="4"
                className="w-full border border-black rounded-md px-3 py-2 text-sm bg-white"
                placeholder="Write your review..."
              />
            </div>

            <button
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-black/80 transition"
            >
              {loading
                ? "Saving..."
                : userReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
