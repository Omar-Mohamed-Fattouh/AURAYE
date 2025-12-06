// src/components/SubscribeSection.jsx
import { useState } from "react";
import { toast } from "sonner";

export default function SubscribeSection({ onSubscribe }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      // If parent passes custom handler, use it
      if (onSubscribe) {
        await onSubscribe(email.trim());
      }

      // demo feedback
      toast.success("You’re subscribed! Check your inbox 🔔");
      setEmail("");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-4 py-10">
      <div className="mx-auto max-w-7xl rounded-3xl bg-black text-white px-6 py-10 md:px-10 md:py-12 shadow-lg">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-xl md:text-3xl font-semibold">
            Get 10% discount for subscribe
          </h2>
          <p className="text-xs md:text-base text-white max-w-4xl">
            Join our community and receive regular updates, exclusive offers,
            and tips delivered straight to your inbox. It&apos;s quick, easy,
            and free.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 w-full max-w-md flex items-center bg-white/10 rounded-full p-1.5 backdrop-blur-sm"
          >
            <label htmlFor="subscribe-email" className="sr-only">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your mail is..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white px-4 py-2.5 focus:outline-none placeholder:text-base"
            />

            <button
              type="submit"
              disabled={loading}
              className="ml-1 rounded-full bg-white text-black text-xs md:text-base font-semibold px-4 md:px-5 py-2.5 shadow-sm hover:bg-indigo-50 transition disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
