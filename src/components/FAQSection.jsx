// src/components/FAQSection.jsx
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Search } from "lucide-react";

const DEFAULT_FAQS = [
  {
    id: 1,
    question: "How do I place an order?",
    answer:
      "Browse the products, add your favorite items to the cart, then go to the checkout page to enter your shipping details and payment method.",
    category: "Orders",
  },
  {
    id: 2,
    question: "Which payment methods do you accept?",
    answer:
      "We currently accept credit / debit cards and cash on delivery in selected areas. Available options are shown at checkout.",
    category: "Payments",
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer:
      "Most orders are delivered within 2–5 business days depending on your location. You’ll receive tracking details by email once your order ships.",
    category: "Shipping",
  },
  {
    id: 4,
    question: "Can I return or exchange my order?",
    answer:
      "Yes. If your item is unused and in its original packaging, you can request a return or exchange within 14 days of delivery.",
    category: "Returns",
  },
  {
    id: 5,
    question: "How can I track my order?",
    answer:
      "After your order is shipped, we’ll send you a tracking link by email and you can also find it in the Orders section of your account.",
    category: "Orders",
  },
  {
    id: 6,
    question: "Do I need an account to place an order?",
    answer:
      "You can check out as a guest, but creating an account lets you track orders, save addresses, and receive personalized recommendations.",
    category: "Account",
  },

  // NEW FAQS
  {
    id: 7,
    question: "Can I cancel my order?",
    answer:
      "Orders can be canceled before they are shipped. Once shipped, cancellation is no longer possible.",
    category: "Orders",
  },
  {
    id: 8,
    question: "What should I do if my payment fails?",
    answer:
      "Ensure your card details are correct or try another payment method. If the issue continues, contact our support team.",
    category: "Payments",
  },
  {
    id: 9,
    question: "Do you offer international shipping?",
    answer:
      "Currently, we only ship domestically. International shipping will be available soon.",
    category: "Shipping",
  },
  {
    id: 10,
    question: "What items are non-returnable?",
    answer:
      "Items marked as final sale, hygiene-related products, or customized items are not eligible for return.",
    category: "Returns",
  },
  {
    id: 11,
    question: "Why didn’t I receive my confirmation email?",
    answer:
      "Check your spam folder or ensure you entered the correct email address. Contact support if the issue continues.",
    category: "Account",
  },
  {
    id: 12,
    question: "How do I reset my password?",
    answer:
      "Click ‘Forgot Password’ on the login page and follow the instructions to reset it via email.",
    category: "Account",
  },
  {
    id: 13,
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, gift wrapping is available for selected products. You can choose this option at checkout.",
    category: "Orders",
  },
  {
    id: 14,
    question: "Are my payment details secure?",
    answer:
      "All transactions are encrypted and processed through secure and trusted payment gateways.",
    category: "Payments",
  },
  {
    id: 15,
    question: "What happens if I’m not home during delivery?",
    answer:
      "The courier will attempt delivery again or contact you to reschedule. You may also collect it from the nearest hub.",
    category: "Shipping",
  },
  {
    id: 16,
    question: "How long do refunds take?",
    answer:
      "Refunds typically take 5–10 business days depending on your bank or payment provider.",
    category: "Returns",
  },
  {
    id: 17,
    question: "Can I update my order after placing it?",
    answer:
      "You can update your shipping address or items before the order is shipped. After shipping, changes are not possible.",
    category: "Orders",
  },
  {
    id: 18,
    question: "Do you save my card details?",
    answer:
      "We do not store card details on our servers. Saved cards are managed securely by our payment provider.",
    category: "Payments",
  },
  {
    id: 19,
    question: "Is express shipping available?",
    answer:
      "Yes, express shipping is available in selected areas for an additional fee.",
    category: "Shipping",
  },
  {
    id: 20,
    question: "My order arrived damaged. What should I do?",
    answer:
      "Please contact support within 48 hours with photos of the damaged item so we can assist you with a replacement or refund.",
    category: "Returns",
  },
];


export default function FAQSection({ faqs = DEFAULT_FAQS, onContactClick }) {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(faqs[0]?.id ?? null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const inCategory =
        selectedCategory === "All" || faq.category === selectedCategory;

      if (!term) return inCategory;

      const text = `${faq.question} ${faq.answer}`.toLowerCase();
      return inCategory && text.includes(term);
    });
  }, [faqs, search, selectedCategory]);

  const toggleId = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white px-4 md:px-8 lg:px-16 py-12 md:py-16">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] items-start">
        {/* LEFT SIDE – TITLE + CHAT */}
        <div className="space-y-8">
          <header>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400 mb-2">
              Support
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Frequently
              <br />
              Asked Questions
            </h2>
          </header>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">
              Can’t find what you are looking for?
            </p>
            <p className="text-base font-semibold text-slate-900">
              We would love to chat with you.
            </p>

            <button
              type="button"
              onClick={onContactClick}
              className="group inline-flex items-center gap-3 rounded-full bg-black text-white px-4 py-2.5 text-sm font-semibold shadow-md hover:bg-black/85 transition"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-sm group-hover:scale-105 transition">
                <MessageCircle className="h-4 w-4" />
              </span>
              <span>Open live chat</span>
            </button>

            <p className="text-xs text-slate-400 max-w-xs">
              Our team typically replies within a few minutes during business
              hours.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE – SEARCH + FAQ LIST */}
        <div className="space-y-4">
          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full rounded-full border border-slate-200 bg-slate-50/60 pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:bg-white focus:border-slate-900 transition"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/80"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All topics" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FAQ list */}
          <div className="rounded-3xl border border-slate-100 bg-slate-50/60 overflow-hidden shadow-sm">
            {filteredFaqs.length === 0 && (
              <div className="px-5 py-6 text-sm text-slate-500">
                No results found for{" "}
                <span className="font-semibold">&ldquo;{search}&rdquo;</span>.
                Try a different keyword or contact our team.
              </div>
            )}

            {filteredFaqs.map((faq, idx) => {
              const isOpen = faq.id === activeId;
              const isLast = idx === filteredFaqs.length - 1;
              return (
                <div
                  key={faq.id}
                  className={`bg-white/90 ${
                    !isLast ? "border-b border-slate-100" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleId(faq.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 md:px-6 py-4 md:py-5 text-left hover:bg-slate-50 transition"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {faq.category && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {faq.category}
                          </span>
                        )}
                        <p className="text-sm md:text-base font-medium text-slate-900">
                          {faq.question}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 ml-2 text-slate-400">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`px-5 md:px-6 overflow-hidden transition-[max-height,opacity] duration-200 ${
                      isOpen ? "max-h-40 md:max-h-52 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="pb-4 md:pb-5 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-right">
            Still stuck?{" "}
            <button
              type="button"
              onClick={onContactClick}
              className="font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Contact support
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
