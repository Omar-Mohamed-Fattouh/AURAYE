// src/pages/ShippingInfo.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orderApi";
import {
  Truck,
  Package,
  AlertCircle,
  Search,
  Filter,
  CreditCard,
  ChevronDown,
  MapPin,
  Calendar,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatEGP } from "../components/formatCurrency";
import SubscribeSection from "../components/SubscribeSection";
import AurayeLoader from "../components/AurayeLoader";

const PAGE_SIZE = 10;

export default function ShippingInfo() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [shippingFilter, setShippingFilter] = useState("all");

  // pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getOrders();
        const data = res?.data ?? res;
        setOrders(Array.isArray(data) ? data : data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .slice()
      .sort((a, b) => {
        const dA = new Date(a.deliveryDate || a.orderDate || a.createdAt || 0);
        const dB = new Date(b.deliveryDate || b.orderDate || b.createdAt || 0);
        return dB - dA;
      })
      .filter((order) => {
        const q = search.trim().toLowerCase();

        if (q) {
          const id = String(order.orderId || order.id || "").toLowerCase();
          const address = String(order.shippingAddress || "").toLowerCase();
          if (!id.includes(q) && !address.includes(q)) return false;
        }

        if (
          statusFilter !== "all" &&
          String(order.status || "").toLowerCase() !== statusFilter.toLowerCase()
        ) {
          return false;
        }

        if (
          paymentFilter !== "all" &&
          String(order.paymentStatus || "").toLowerCase() !==
            paymentFilter.toLowerCase()
        ) {
          return false;
        }

        if (
          shippingFilter !== "all" &&
          String(order.shippingStatus || "").toLowerCase() !==
            shippingFilter.toLowerCase()
        ) {
          return false;
        }

        return true;
      });
  }, [orders, search, statusFilter, paymentFilter, shippingFilter]);

  // reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, paymentFilter, shippingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageOrders = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, safePage]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setShippingFilter("all");
    setPage(1);
  };

  // ✅ AURAYE loader
  if (loading) {
    return <AurayeLoader label="Loading orders" subtitle="AURAYE" />;
  }

  if (error) {
    return (
      <div className="min-h-[50vh] bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-black/10 bg-white p-6 flex items-center gap-3 text-black shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          <AlertCircle className="w-5 h-5 text-black/70" />
          <p className="text-sm font-medium text-black/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[50vh] bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-black/10 bg-white p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
          <Package className="w-10 h-10 mx-auto mb-3 text-black/40" />
          <h2 className="text-lg font-semibold text-black">No orders yet</h2>
          <p className="text-sm text-black/60 mt-1">
            When you place an order, its shipping details will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <main className="container mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl border border-black/10 bg-black text-white grid place-items-center">
                  <Truck className="w-4 h-4" />
                </div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-black">
                  Shipping & Orders
                </h1>
              </div>
              <p className="text-sm text-black/60 mt-2">
                Track your orders, payment status, and delivery details.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs md:text-sm text-black/70">
                <Package className="w-4 h-4 text-black/50" />
                <span>
                  {orders.length} order{orders.length > 1 ? "s" : ""} in total
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-3 py-1.5 text-xs md:text-sm text-white">
                <span className="opacity-90">Showing</span>
                <span className="font-semibold">{filteredOrders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-3xl border border-black/10 bg-white p-4 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-black/50 uppercase tracking-[0.18em]">
              <Filter className="w-4 h-4" />
              <span>Filters & search</span>
            </div>

            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/70
                         hover:bg-black/5 transition"
              type="button"
            >
              <X className="w-4 h-4 text-black/45" />
              Clear
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,460px] gap-3 lg:items-end">
            {/* Search */}
            <div className="space-y-1.5">
              <LabelThin>Search</LabelThin>
              <div className="relative">
                <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by order ID or address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-black/10 bg-white text-sm text-black
                             focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30
                             placeholder:text-black/35"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <SelectBox label="Order Status" value={statusFilter} onChange={setStatusFilter}>
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </SelectBox>

              <SelectBox label="Payment" value={paymentFilter} onChange={setPaymentFilter}>
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Awaiting Payment">Awaiting Payment</option>
                <option value="Paid">Paid</option>
                <option value="Succeeded">Succeeded</option>
                <option value="Failed">Failed</option>
                <option value="Refund Pending">Refund Pending</option>
              </SelectBox>

              <SelectBox label="Shipping" value={shippingFilter} onChange={setShippingFilter}>
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </SelectBox>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Pill
              text={`Showing ${filteredOrders.length} result${
                filteredOrders.length !== 1 ? "s" : ""
              }`}
            />
            <Pill text={`Page size: ${PAGE_SIZE}`} />
            <Pill
              text={`Filters: ${
                statusFilter !== "all" ||
                paymentFilter !== "all" ||
                shippingFilter !== "all" ||
                !!search
                  ? "On"
                  : "Off"
              }`}
            />
          </div>
        </section>

        {/* Orders list */}
        <section className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-4 flex gap-2 text-black/70 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
              <AlertCircle className="w-4 h-4 mt-0.5 text-black/50" />
              <p>No orders match the current search and filters.</p>
            </div>
          ) : (
            pageOrders.map((order) => {
              const id = order.orderId || order.id;

              const itemsCount =
                order.items?.length ??
                order.orderItems?.length ??
                order.itemsCount ??
                0;

              const paymentStatus = order.paymentStatus || "—";
              const shippingStatus = order.shippingStatus || "—";
              const status = order.status || "Pending";

              const date = order.deliveryDate || order.orderDate || order.createdAt;

              const statusTone =
                String(status).toLowerCase() === "delivered"
                  ? "border-black/10 bg-black text-white"
                  : String(status).toLowerCase() === "cancelled"
                  ? "border-black/15 bg-white text-black"
                  : "border-black/10 bg-white text-black";

              return (
                <article
                  key={id}
                  className="rounded-3xl border border-black/10 bg-white p-5 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]"
                >
                  {/* Top row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">Order #{id}</p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/55">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-black/35" />
                          {date ? new Date(date).toLocaleString() : "Date not available"}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-black/35" />
                          {order.shippingAddress ? "Address saved" : "No address"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${statusTone}`}
                      >
                        <Package
                          className={`w-3.5 h-3.5 mr-1.5 ${
                            String(status).toLowerCase() === "delivered"
                              ? "text-white"
                              : "text-black/60"
                          }`}
                        />
                        {status}
                      </span>

                      <span className="text-[11px] text-black/55">
                        {itemsCount || 0} item{(itemsCount || 0) !== 1 ? "s" : ""}
                      </span>

                      {/* ✅ TRACK BUTTON */}
                      <Link
                        to={`/track/${id}`}
                        className="group inline-flex items-center gap-2 rounded-2xl bg-black text-white px-3.5 py-2 text-xs font-semibold
                                   shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                                   hover:bg-black/90 transition"
                      >
                        Track
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid lg:grid-cols-3 gap-4 text-sm">
                    <InfoBlock
                      label="Total amount"
                      value={formatEGP(order.totalAmount || order.total || 0)}
                      subLabel="Shipping cost"
                      subValue={formatEGP(order.shippingCost || 0)}
                    />

                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-[11px] uppercase text-black/45 tracking-wide">
                        Payment status
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-black/80">
                        <CreditCard className="w-3.5 h-3.5 text-black/45" />
                        <span className="font-medium">{paymentStatus}</span>
                      </p>

                      <p className="text-[11px] uppercase text-black/45 tracking-wide mt-3">
                        Shipping status
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 text-black/80">
                        <Truck className="w-3.5 h-3.5 text-black/45" />
                        <span className="font-medium">{shippingStatus}</span>
                      </p>

                      <div className="mt-4 rounded-xl border border-black/10 bg-black/5 p-3">
                        <p className="text-[11px] font-semibold text-black/70">
                          Quick action
                        </p>
                        <p className="text-xs text-black/55 mt-1">
                          Tap <b>Track</b> to view the live delivery progress.
                        </p>
                      </div>
                    </div>

                    {/* ✅ Address + Map */}
                    <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-3">
                      <div>
                        <p className="text-[11px] uppercase text-black/45 tracking-wide">
                          Shipping address
                        </p>
                        <p className="mt-1 text-black/75 text-sm leading-snug">
                          {order.shippingAddress || "—"}
                        </p>
                      </div>

                      {order.shippingAddress ? (
                        <div className="rounded-2xl border border-black/10 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-black/5">
                            <span className="text-[11px] font-semibold text-black/70">
                              Location on map
                            </span>
                            <span className="text-[11px] text-black/45">
                              Embedded view
                            </span>
                          </div>
                          <MapEmbed address={order.shippingAddress} />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-black/10 bg-black/5 p-3 text-xs text-black/60">
                          Add a shipping address to view the map location.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* ✅ Pagination */}
        {filteredOrders.length > PAGE_SIZE && (
          <div className="rounded-3xl border border-black/10 bg-white p-4 md:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-black/70">
                Page <span className="font-semibold text-black">{safePage}</span> of{" "}
                <span className="font-semibold text-black">{totalPages}</span>
                <span className="text-black/40"> · </span>
                <span className="text-black/60">
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {pageOrders.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-black">
                    {filteredOrders.length}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold
                             text-black/80 hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-3 py-2 text-sm font-semibold
                             hover:bg-black/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <SubscribeSection />
      </main>
    </div>
  );
}

/* -------------------- tiny UI helpers -------------------- */

function LabelThin({ children }) {
  return (
    <p className="text-[11px] font-semibold text-black/55 uppercase tracking-[0.18em]">
      {children}
    </p>
  );
}

function Pill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-black/60">
      {text}
    </span>
  );
}

function SelectBox({ label, value, onChange, children }) {
  return (
    <div className="space-y-1.5">
      <LabelThin>{label}</LabelThin>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-black/10 bg-white
                     px-3 py-2.5 pr-9 text-xs md:text-sm text-black/80
                     focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/35" />
      </div>
    </div>
  );
}

function InfoBlock({ label, value, subLabel, subValue }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-[11px] uppercase text-black/45 tracking-wide">{label}</p>
      <p className="mt-1 font-semibold text-black">{value}</p>

      <p className="text-[11px] uppercase text-black/45 tracking-wide mt-3">
        {subLabel}
      </p>
      <p className="mt-1 text-black/75">{subValue}</p>
    </div>
  );
}

/* -------------------- Map embed -------------------- */
/**
 * Uses Google Maps "q" embed without an API key.
 * If your CSP blocks google.com in iframe, you can whitelist it or swap provider.
 */
function MapEmbed({ address }) {
  const src = useMemo(() => {
    const q = encodeURIComponent(address);
    return `https://www.google.com/maps?q=${q}&output=embed`;
  }, [address]);

  return (
    <iframe
      title="Shipping location"
      src={src}
      className="w-full h-[220px] border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
