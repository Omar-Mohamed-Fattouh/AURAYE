// src/pages/ShippingInfo.jsx
import { useEffect, useState, useMemo } from "react";
import { getOrders } from "../api/orderApi";
import {
  Truck,
  Package,
  AlertCircle,
  Search,
  Filter,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { formatEGP } from "../components/formatCurrency";
import SubscribeSection from "../components/SubscribeSection";
import AurayeLoader from "../components/AurayeLoader";

export default function ShippingInfo() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [shippingFilter, setShippingFilter] = useState("all");

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

  // ✅ AURAYE loader (keep consistent with the rest of the website)
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
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Header (thin) */}
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

            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs md:text-sm text-black/70">
              <Package className="w-4 h-4 text-black/50" />
              <span>
                {orders.length} order{orders.length > 1 ? "s" : ""} in total
              </span>
            </div>
          </div>
        </div>

        {/* Filters (thin + styled dropdowns) */}
        <section className="rounded-3xl border border-black/10 bg-white p-4 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-black/50 uppercase tracking-[0.18em]">
            <Filter className="w-4 h-4" />
            <span>Filters & search</span>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {/* Search */}
            <div className="flex-1 relative">
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

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-[460px]">
              <SelectThin value={statusFilter} onChange={setStatusFilter}>
                <option value="all">Status: All</option>
                <option value="Pending">Status: Pending</option>
                <option value="Processing">Status: Processing</option>
                <option value="Shipped">Status: Shipped</option>
                <option value="Delivered">Status: Delivered</option>
                <option value="Cancelled">Status: Cancelled</option>
              </SelectThin>

              <SelectThin value={paymentFilter} onChange={setPaymentFilter}>
                <option value="all">Payment: All</option>
                <option value="Pending">Payment: Pending</option>
                <option value="Awaiting Payment">Awaiting Payment</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </SelectThin>

              <SelectThin value={shippingFilter} onChange={setShippingFilter}>
                <option value="all">Shipping: All</option>
                <option value="Pending">Shipping: Pending</option>
                <option value="Processing">Shipping: Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </SelectThin>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Pill text={`Showing ${filteredOrders.length} result${filteredOrders.length !== 1 ? "s" : ""}`} />
            <Pill text={`Search: ${search ? "On" : "Off"}`} />
            <Pill text={`Filters: ${statusFilter !== "all" || paymentFilter !== "all" || shippingFilter !== "all" ? "On" : "Off"}`} />
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
            filteredOrders.map((order) => {
              const id = order.orderId || order.id;
              const itemsCount =
                order.items?.length ??
                order.orderItems?.length ??
                order.itemsCount ??
                0;

              const paymentStatus = order.paymentStatus || "—";
              const shippingStatus = order.shippingStatus || "—";
              const status = order.status || "Pending";

              const date =
                order.deliveryDate || order.orderDate || order.createdAt;

              const statusTone =
                status === "Delivered"
                  ? "border-black/10 bg-black text-white"
                  : status === "Cancelled"
                  ? "border-black/15 bg-white text-black"
                  : "border-black/10 bg-white text-black";

              return (
                <article
                  key={id}
                  className="rounded-3xl border border-black/10 bg-white p-5 md:p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        Order #{id}
                      </p>
                      <p className="text-xs text-black/55 mt-1">
                        {date ? new Date(date).toLocaleString() : "Date not available"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${statusTone}`}
                      >
                        <Package className={`w-3.5 h-3.5 mr-1.5 ${status === "Delivered" ? "text-white" : "text-black/60"}`} />
                        {status}
                      </span>

                      <span className="text-[11px] text-black/55">
                        {itemsCount || 0} item{(itemsCount || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
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
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-[11px] uppercase text-black/45 tracking-wide">
                        Shipping address
                      </p>
                      <p className="mt-1 text-black/75 text-sm leading-snug">
                        {order.shippingAddress || "—"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <SubscribeSection />
      </main>
    </div>
  );
}

/* -------------------- tiny UI helpers -------------------- */

function Pill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-black/60">
      {text}
    </span>
  );
}

function SelectThin({ value, onChange, children }) {
  return (
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
  );
}

function InfoBlock({ label, value, subLabel, subValue }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-[11px] uppercase text-black/45 tracking-wide">{label}</p>
      <p className="mt-1 font-semibold text-black">{value}</p>

      <p className="text-[11px] uppercase text-black/45 tracking-wide mt-3">{subLabel}</p>
      <p className="mt-1 text-black/75">{subValue}</p>
    </div>
  );
}
