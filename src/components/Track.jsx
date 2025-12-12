// src/pages/Track.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Package,
  CreditCard,
  Truck,
  MapPin,
  Calendar,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { getOrderById } from "../api/orderApi";
import AurayeLoader from "../components/AurayeLoader";
import { formatEGP } from "../components/formatCurrency";

const BASE_URL = "https://graduationproject11.runasp.net";

function fmtDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString();
}

function safeStr(v) {
  return v == null ? "" : String(v);
}

function computeStepIndex(order) {
  const status = safeStr(order?.status).toLowerCase();
  const shipping = safeStr(order?.shippingStatus).toLowerCase();
  const payment = safeStr(order?.paymentStatus).toLowerCase();

  if (shipping.includes("cancel") || status.includes("cancel"))
    return { step: 0, cancelled: true };

  if (shipping.includes("delivered") || status === "delivered")
    return { step: 4, cancelled: false };

  if (shipping.includes("shipped") || shipping.includes("out for delivery"))
    return { step: 3, cancelled: false };

  if (status === "processing") return { step: 2, cancelled: false };

  if (payment.includes("succeed") || payment.includes("paid"))
    return { step: 1, cancelled: false };

  return { step: 0, cancelled: false };
}

function badgeTone(v) {
  const s = safeStr(v).toLowerCase();
  if (s.includes("delivered") || s === "delivered") return "bg-black text-white";
  if (s.includes("cancel")) return "bg-white text-black border border-black/15";
  return "bg-black/5 text-black border border-black/10";
}

export default function Track() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { step: activeStep, cancelled } = useMemo(
    () => computeStepIndex(order),
    [order]
  );

  const steps = useMemo(
    () => [
      { key: "placed", label: "Order Placed", hint: "We received your order" },
      { key: "paid", label: "Payment", hint: "Payment confirmation" },
      { key: "proc", label: "Processing", hint: "Preparing your items" },
      { key: "ship", label: "Shipping", hint: "On the way to you" },
      { key: "del", label: "Delivered", hint: "Arrived successfully" },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrderById(id);
        const o = data?.data ?? data;

        if (!mounted) return;

        if (!o || (!o.orderId && !o.id)) {
          setOrder(null);
          setError("Order not found.");
          return;
        }

        setOrder(o);
      } catch (e) {
        if (!mounted) return;
        setOrder(null);
        setError("Failed to load order. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const items = useMemo(() => order?.items || order?.orderItems || [], [order]);

  const subtotal = useMemo(() => {
    if (!items?.length) return 0;
    return items.reduce(
      (sum, it) => sum + Number(it.unitPrice || it.price || 0) * Number(it.quantity || 0),
      0
    );
  }, [items]);

  const total = Number(order?.totalAmount ?? order?.total ?? 0);
  const shippingCost = Number(order?.shippingCost ?? 0);

  if (loading) return <AurayeLoader label="Loading tracking" subtitle="AURAYE" />;

  if (error) {
    return (
      <div className="min-h-screen bg-white text-black px-4 py-10">
        <div className="max-w-3xl mx-auto rounded-3xl border border-black/10 p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-black/5 border border-black/10 grid place-items-center">
              <AlertCircle className="w-5 h-5 text-black/60" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Something went wrong</h1>
              <p className="text-black/60 mt-1">{error}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(0)}
                  className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-4 py-2.5 text-sm font-semibold hover:bg-black/90 transition"
                >
                  Retry
                </button>
                <Link
                  to="/track"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/15 px-4 py-2.5 text-sm font-semibold hover:border-black/30 transition"
                >
                  Back to Track
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white text-black px-4 py-10">
        <div className="max-w-3xl mx-auto rounded-3xl border border-black/10 p-6 sm:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold">Order not found</h1>
          <p className="text-black/60 mt-2">Check the Order ID and try again.</p>
          <Link
            to="/track"
            className="inline-flex mt-5 px-4 py-2.5 rounded-2xl border border-black/15 hover:border-black/30 transition"
          >
            Go to Track page
          </Link>
        </div>
      </div>
    );
  }

  const orderId = order.orderId ?? order.id;

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/track"
                className="inline-flex items-center justify-center h-10 w-10 rounded-2xl border border-black/10 hover:border-black/25 transition"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Track Order #{orderId}
              </h1>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-black/60">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4 text-black/35" />
                Delivery: <span className="text-black/80">{fmtDate(order.deliveryDate)}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-black/35" />
                {order.shippingAddress ? "Address available" : "No address"}
              </span>
            </div>
          </div>

          <Link
            to="/track"
            className="inline-flex justify-center px-4 py-2.5 rounded-2xl border border-black/15 hover:border-black/30 transition text-sm font-semibold"
          >
            Track another order
          </Link>
        </div>

        {/* Status + timeline */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 sm:p-7 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          {/* badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={[
                "px-3 py-1.5 rounded-full text-xs font-semibold",
                badgeTone(order.status),
              ].join(" ")}
            >
              Status: {order.status || "-"}
            </span>
            <span
              className={[
                "px-3 py-1.5 rounded-full text-xs font-semibold",
                badgeTone(order.paymentStatus),
              ].join(" ")}
            >
              Payment: {order.paymentStatus || "-"}
            </span>
            <span
              className={[
                "px-3 py-1.5 rounded-full text-xs font-semibold",
                badgeTone(order.shippingStatus),
              ].join(" ")}
            >
              Shipping: {order.shippingStatus || "-"}
            </span>
          </div>

          {/* cancelled note */}
          {cancelled && (
            <div className="mt-5 rounded-2xl border border-black/10 bg-black/5 p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white border border-black/10 grid place-items-center">
                <X className="w-5 h-5 text-black/60" />
              </div>
              <div>
                <p className="font-semibold">This order was cancelled.</p>
                <p className="text-black/60 text-sm mt-1">
                  Payment: {order.paymentStatus || "-"} • Shipping:{" "}
                  {order.shippingStatus || "-"}
                </p>
              </div>
            </div>
          )}

          {/* timeline */}
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {steps.map((s, idx) => {
                const done = idx < activeStep && !cancelled;
                const current = idx === activeStep && !cancelled;

                return (
                  <div key={s.key} className="relative">
                    <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                      <div className="flex items-center sm:w-full">
                        <div
                          className={[
                            "h-10 w-10 rounded-2xl grid place-items-center border transition",
                            done
                              ? "bg-black text-white border-black"
                              : current
                              ? "bg-white border-black/40 ring-4 ring-black/10"
                              : "bg-white border-black/10 text-black/60",
                          ].join(" ")}
                        >
                          {done ? <Check className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>

                        {/* connector (desktop) */}
                        {idx !== steps.length - 1 && (
                          <div className="hidden sm:block flex-1 h-[2px] mx-3 bg-black/10 rounded-full overflow-hidden">
                            <div
                              className={[
                                "h-full rounded-full transition-all duration-500",
                                idx < activeStep && !cancelled ? "w-full bg-black" : "w-0 bg-transparent",
                              ].join(" ")}
                            />
                          </div>
                        )}
                      </div>

                      <div className="sm:mt-3">
                        <p className="text-sm font-semibold">{s.label}</p>
                        <p className="text-xs text-black/55 mt-1">{s.hint}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* mobile connector hint */}
            <p className="sm:hidden mt-4 text-xs text-black/50">
              Timeline updates as your payment and shipping status changes.
            </p>
          </div>
        </div>

        {/* Items + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-5 sm:p-7 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold">Items</h2>

            {!items.length ? (
              <p className="text-black/60 mt-3">No items found in this order.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map((it, i) => {
                  const name = it.productName || it.title || `Item ${i + 1}`;
                  const img = it.imageUrl ? `${BASE_URL}${it.imageUrl}` : null;
                  const qty = Number(it.quantity || 0);
                  const unit = Number(it.unitPrice || it.price || 0);
                  const line = unit * qty;

                  return (
                    <div
                      key={`${name}-${i}`}
                      className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-3"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 overflow-hidden flex items-center justify-center shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-black/40">No image</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{name}</p>
                        <p className="text-sm text-black/60 mt-1">
                          Color: {it.selectedColor || "-"} • Qty: {qty}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatEGP(line)}</p>
                        <p className="text-xs text-black/50">{formatEGP(unit)} each</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-3xl border border-black/10 bg-white p-5 sm:p-7 h-fit shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold">Summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatEGP(subtotal)} />
              <Row label="Shipping" value={formatEGP(shippingCost)} />

              <div className="h-px bg-black/10 my-3" />

              <Row label="Total" value={formatEGP(total)} strong />
            </div>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/5 p-4">
              <h3 className="text-sm font-semibold">Shipping Address</h3>
              <p className="text-sm text-black/70 mt-1">
                {order.shippingAddress || "-"}
              </p>
            </div>

            <div className="mt-4">
              <Link
                to="/shipping"
                className="w-full inline-flex items-center justify-center rounded-2xl border border-black/15 px-4 py-2.5 text-sm font-semibold hover:border-black/30 transition"
              >
                View all orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-black/65">{label}</span>
      <span className={strong ? "font-semibold text-black" : "text-black/80"}>
        {value}
      </span>
    </div>
  );
}
