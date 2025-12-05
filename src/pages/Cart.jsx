import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  moveCartItemToWishlist,
  clearCart,
} from "../api/productsApi";

import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatEGP } from "../components/formatCurrency";

const BASE_URL = "http://graduation-project1.runasp.net";
const FREE_SHIPPING = 1500;

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    type: null, // "remove" | "move" | "clear"
    itemId: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  const navigate = useNavigate();

  // ---------------- GET CART ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to log in to view your cart.");
      navigate("/login");
      return;
    }

    let mounted = true;

    async function fetchCart() {
      try {
        setLoading(true);
        const response = await getCart();

        const mapped = (response.items || []).map((item) => ({
          id: item.cartItemId,
          productId: item.productId,
          name: item.title,
          quantity: item.quantity,
          price: item.unitPrice,
          imageUrl: item.imageUrl
            ? item.imageUrl.startsWith("http")
              ? item.imageUrl
              : BASE_URL + item.imageUrl
            : "/placeholder.png",
          color: item.color,
          size: item.size,
          stockQuantity: item.stockQuantity ?? 99,
        }));

        if (mounted) setItems(mapped);
      } catch (err) {
        console.error("Failed to load cart:", err);
        toast.error("Failed to load cart.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCart();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // ---------------- TOTALS ----------------
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    const c = appliedPromo.toUpperCase();
    if (c === "SAVE10") return subtotal * 0.1;
    if (c === "WELCOME50") return 50;
    return 0;
  }, [appliedPromo, subtotal]);

  const base = Math.max(subtotal - discount, 0);
  const shipping = base === 0 ? 0 : base >= FREE_SHIPPING ? 0 : 80;
  const tax = base * 0.14;
  const total = base + shipping + tax;
  const amountToFreeShipping = Math.max(FREE_SHIPPING - base, 0);

  // ------------- PROCESSING IDS (disable row) -------------
  const setProcessing = useCallback((id, v) => {
    setProcessingIds((prev) => {
      const next = new Set(prev);
      if (v) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // ------------- QUANTITY HANDLERS -------------
  const handleIncrement = async (itemId) => {
    const prev = [...items];
    const target = prev.find((i) => i.id === itemId);
    if (!target) return;

    const newQty = Number(target.quantity || 1) + 1;
    setItems((curr) =>
      curr.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
    setProcessing(itemId, true);

    try {
      await updateCartItemQuantity(itemId, newQty);
    } catch (err) {
      console.error("Update qty failed:", err);
      setItems(prev);
      toast.error("Failed to update quantity.");
    } finally {
      setProcessing(itemId, false);
    }
  };

  const handleDecrement = async (itemId) => {
    const prev = [...items];
    const target = prev.find((i) => i.id === itemId);
    if (!target) return;
    if (target.quantity <= 1) return;

    const newQty = Number(target.quantity || 1) - 1;
    setItems((curr) =>
      curr.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
    setProcessing(itemId, true);

    try {
      await updateCartItemQuantity(itemId, newQty);
    } catch (err) {
      console.error("Update qty failed:", err);
      setItems(prev);
      toast.error("Failed to update quantity.");
    } finally {
      setProcessing(itemId, false);
    }
  };

  const handleChangeQuantityDirect = async (itemId, qty) => {
    const prev = [...items];
    const target = prev.find((i) => i.id === itemId);
    if (!target) return;

    const newQty = Math.max(1, Number(qty) || 1);
    setItems((curr) =>
      curr.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
    setProcessing(itemId, true);

    try {
      await updateCartItemQuantity(itemId, newQty);
    } catch (err) {
      console.error("Update qty failed:", err);
      setItems(prev);
      toast.error("Failed to update quantity.");
    } finally {
      setProcessing(itemId, false);
    }
  };

  // ------------- CONFIRM DIALOG -------------
  const openConfirm = (type, itemId = null) => {
    setConfirmConfig({ open: true, type, itemId });
  };
  const closeConfirm = () =>
    setConfirmConfig({ open: false, type: null, itemId: null });

  const handleAskRemove = (itemId) => openConfirm("remove", itemId);
  const handleAskMoveToWishlist = (itemId) => openConfirm("move", itemId);
  const handleAskClearCart = () => openConfirm("clear", null);

  const handleConfirm = async () => {
    const { type, itemId } = confirmConfig;
    if (!type) return;

    setConfirmLoading(true);

    try {
      if (type === "remove" && itemId != null) {
        const prev = [...items];
        setItems((curr) => curr.filter((i) => i.id !== itemId));
        try {
          await removeCartItem(itemId);
          toast.success("Item removed from cart.");
        } catch (err) {
          console.error("Remove failed:", err);
          setItems(prev);
          toast.error("Failed to remove item.");
        }
      }

      if (type === "move" && itemId != null) {
        const prev = [...items];
        setItems((curr) => curr.filter((i) => i.id !== itemId));
        try {
          await moveCartItemToWishlist(itemId);
          toast.success("Item moved to wishlist.");
        } catch (err) {
          console.error("Move to wishlist failed:", err);
          setItems(prev);
          toast.error("Failed to move item to wishlist.");
        }
      }

      if (type === "clear") {
        const prev = [...items];
        setItems([]);
        try {
          await clearCart();
          toast.success("Cart cleared.");
        } catch (err) {
          console.error("Clear cart failed:", err);
          setItems(prev);
          toast.error("Failed to clear cart.");
        }
      }
    } finally {
      setConfirmLoading(false);
      closeConfirm();
    }
  };

  // ------------- PROMO -------------
  const handleApplyPromo = (code) => {
    const c = code.trim().toUpperCase();
    if (!c) {
      setAppliedPromo(null);
      toast("Promo cleared.");
      return;
    }

    if (["SAVE10", "WELCOME50"].includes(c)) {
      setAppliedPromo(c);
      setPromoCode(c);
      toast.success(`Promo "${c}" applied.`);
    } else {
      setAppliedPromo(null);
      toast.error("Invalid promo code.");
    }
  };

  // ------------- RENDER STATES -------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <main className="w-full max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-7 w-56 bg-gray-200 rounded" />
            <div className="grid md:grid-cols-[minmax(0,2.2fr)_minmax(320px,1fr)] gap-8">
              <div className="h-80 bg-white rounded-2xl shadow-sm" />
              <div className="h-80 bg-white rounded-2xl shadow-sm" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#f7f7f8]">
        <main className="w-full max-w-5xl mx-auto px-6 py-20">
          <div className="border border-gray-200 rounded-2xl p-12 bg-white text-center shadow-sm">
            <ShoppingBag className="h-14 w-14 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-6">
              Start adding your favorite frames and sunglasses.
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-black text-white rounded-full text-sm font-semibold tracking-wide hover:bg-gray-900 transition inline-flex items-center justify-center"
            >
              Browse products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <main className="w-full max-w-fit mx-auto px-6 pt-10">
        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-gray-900" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {items.length} item{items.length > 1 ? "s" : ""} ·{" "}
                {formatEGP(subtotal)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAskClearCart}
              className="text-sm text-white bg-black px-4 py-2 rounded-full border  hover:bg-black/60 transition"
            >
              Clear cart
            </button>
            <Link
              to="/products"
              className="text-sm bg-white px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
              Continue shopping
            </Link>
          </div>
        </header>

        {/* LAYOUT */}
        <div className="grid md:grid-cols-[minmax(0,2.3fr)_minmax(320px,1fr)] gap-8 items-start">
          {/* LEFT: ITEMS TABLE */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6">
            {/* TABLE HEADER (DESKTOP) */}
            <div className="hidden md:grid md:grid-cols-[minmax(0,2.4fr)_0.9fr_1fr] text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] pb-3 border-b border-gray-100 mb-1">
              <div>Item</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {/* ROWS */}
            <div>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleAskRemove}
                  onMoveToWishlist={handleAskMoveToWishlist}
                  onChangeQuantityDirect={handleChangeQuantityDirect}
                  processing={processingIds.has(item.id)}
                />
              ))}
            </div>

            {/* SUBTOTAL ROW */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-700">
              <span>
                {items.length} item{items.length > 1 ? "s" : ""}
              </span>
              <span className="font-semibold">
                Subtotal: {formatEGP(subtotal)}
              </span>
            </div>
          </section>

          {/* RIGHT: SUMMARY CARD */}
          <CartSummary
            itemsCount={items.length}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            tax={tax}
            total={total}
            amountToFreeShipping={amountToFreeShipping}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            onApplyPromo={handleApplyPromo}
            onClearCart={handleAskClearCart}
          />
        </div>
      </main>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmConfig.open}
        loading={confirmLoading}
        title={
          confirmConfig.type === "remove"
            ? "Remove item from cart?"
            : confirmConfig.type === "move"
            ? "Move item to wishlist?"
            : "Clear your cart?"
        }
        message={
          confirmConfig.type === "remove"
            ? "Are you sure you want to remove this item from your cart?"
            : confirmConfig.type === "move"
            ? "This will move the item to your wishlist and remove it from your cart."
            : "This will remove all items from your cart. You can’t undo this action."
        }
        confirmLabel={
          confirmConfig.type === "remove"
            ? "Remove"
            : confirmConfig.type === "move"
            ? "Move"
            : "Clear cart"
        }
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
