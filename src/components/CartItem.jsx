// src/components/CartItem.jsx
import { Plus, Minus, Trash2, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { formatEGP } from "../components/formatCurrency";

export default function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onMoveToWishlist,
  onChangeQuantityDirect,
  processing = false,
}) {
  const eachPrice = Number(item.price || 0);
  const totalPrice = eachPrice * Number(item.quantity || 1);
  const canDecrement = Number(item.quantity) > 1;
  const [localQty, setLocalQty] = useState(item.quantity || 1);

  useEffect(() => {
    setLocalQty(item.quantity || 1);
  }, [item.quantity]);

  const handleBlurQty = async () => {
    const qty = Math.max(1, Number(localQty) || 1);
    setLocalQty(qty);
    if (qty !== item.quantity && onChangeQuantityDirect) {
      await onChangeQuantityDirect(item.id, qty);
    }
  };

  return (
    <article className="py-5 border-b border-gray-100 last:border-b-0">
      <div className="md:grid md:grid-cols-[minmax(0,2.4fr)_0.8fr_1.1fr] md:items-start md:gap-4">
        {/* COLUMN 1: IMAGE + INFO */}
        <div className="flex gap-4">
          <div className="w-24 h-28 md:w-32 md:h-36  overflow-hidden shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
              {item.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {item.color && (
                <span className="inline-flex items-center gap-2 px-2 py-0.5  bg-white ">
                  <span
                    className="w-3 h-3 rounded-full border"
                    style={{
                      background:
                        item.color.toLowerCase() === "black"
                          ? "#111827"
                          : item.color.toLowerCase(),
                    }}
                    aria-hidden
                  />
                  <span className="font-medium capitalize">{item.color}</span>
                </span>
              )}

              {item.size && (
                <span className="px-2 py-0.5  bg-white ">
                  Size: <span className="font-medium ml-1">{item.size}</span>
                </span>
              )}

              <span
                className={`px-2 py-0.5  text-sm  ${
                  item.stockQuantity > 0
                    ? " text-emerald-700 "
                    : " text-red-700"
                }`}
              >
                {item.stockQuantity > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>

            {/* EACH PRICE (DESKTOP) */}
            <div className="mt-3 hidden md:block">
              <p className="text-xs uppercase text-gray-400 tracking-wide">
                Each
              </p>
              <p className="font-medium text-gray-900">
                {formatEGP(eachPrice)}
              </p>
            </div>

            {/* EACH PRICE (MOBILE) */}
            <div className="mt-3 md:hidden">
              <p className="text-xs uppercase text-gray-400 tracking-wide">
                Each
              </p>
              <p className="font-semibold text-gray-900">
                {formatEGP(eachPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: QTY */}
        <div className="mt-4 md:mt-0 flex md:justify-center">
          <div
            className={`inline-flex items-center bg-white overflow-hiddentransition ${
              processing ? "opacity-70 pointer-events-none" : ""
            }`}
          >
            <button
              aria-label="Decrease quantity"
              onClick={() => {
                if (canDecrement) onDecrement(item.id);
              }}
              disabled={!canDecrement || processing}
              className={`px-3 py-2 transition ${
                canDecrement
                  ? "hover:bg-gray-100 text-gray-800"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              min={1}
              value={localQty}
              onChange={(e) => setLocalQty(e.target.value)}
              onBlur={handleBlurQty}
              className="w-16 text-center text-sm font-semibold px-2 py-2 outline-none"
              aria-label="Quantity"
              disabled={processing}
            />

            <button
              aria-label="Increase quantity"
              onClick={() => onIncrement(item.id)}
              disabled={processing}
              className="px-3 py-2 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* COLUMN 3: TOTAL + ACTIONS */}
        <div className="mt-4 md:mt-0 flex flex-col items-end gap-3">
          <div className="text-right">
            <p className="text-base uppercase text-gray-500 tracking-wide">
              Total
            </p>
            <p className="font-semibold text-gray-900">
              {formatEGP(totalPrice)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-1 justify-end">
            <button
              type="button"
              onClick={() => onMoveToWishlist(item.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5  text-xs md:text-sm text-gray-700 hover:text-black hover:font-semibold transition"
            >
              <Heart className="w-5 h-5" />
              <span>Move to wishlist</span>
            </button>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm text-red-600 hover:text-red-400 transition"
            >
              <Trash2 className="w-5 h-5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
