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
} from "lucide-react";
import { formatEGP } from "../components/formatCurrency";

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
        const data = await getOrders();
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
          String(order.status || "").toLowerCase() !==
            statusFilter.toLowerCase()
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

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-100 shadow-sm p-8 animate-pulse space-y-6">
          <div className="h-6 w-40 bg-slate-200 rounded" />
          <div className="h-11 bg-slate-100 rounded-xl" />
          <div className="space-y-3">
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-6 flex items-center gap-3 text-red-700 shadow-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[40vh] bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
          <Package className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">
            No orders yet
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            When you place an order, its shipping details will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <main className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Shipping & Orders
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track your orders, payment status, and delivery details.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm bg-slate-50 rounded-full px-3 py-1 border border-slate-100">
            <Package className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">
              {orders.length} order{orders.length > 1 ? "s" : ""} in total
            </span>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-[0.16em]">
            <Filter className="w-4 h-4" />
            <span>Filters & search</span>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order ID or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>

            {/* Status filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-[420px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white text-xs md:text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                <option value="all">Status: All</option>
                <option value="Pending">Status: Pending</option>
                <option value="Processing">Status: Processing</option>
                <option value="Shipped">Status: Shipped</option>
                <option value="Delivered">Status: Delivered</option>
                <option value="Cancelled">Status: Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white text-xs md:text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                <option value="all">Payment: All</option>
                <option value="Pending">Payment: Pending</option>
                <option value="Awaiting Payment">Awaiting Payment</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>

              <select
                value={shippingFilter}
                onChange={(e) => setShippingFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white text-xs md:text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              >
                <option value="all">Shipping: All</option>
                <option value="Pending">Shipping: Pending</option>
                <option value="Processing">Shipping: Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </section>

        {/* Orders list */}
        <section className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 flex gap-2 text-amber-800 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" />
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

              const date = order.deliveryDate || order.orderDate || order.createdAt;

              const statusColor =
                status === "Delivered"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : status === "Cancelled"
                  ? "bg-rose-50 text-rose-700 border-rose-100"
                  : "bg-slate-50 text-slate-700 border-slate-200";

              return (
                <article
                  key={id}
                  className="border border-slate-100 rounded-2xl px-4 py-4 md:px-5 md:py-4 bg-slate-50/40 flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Order #{id}
                      </p>
                      <p className="text-xs text-slate-500">
                        {date
                          ? new Date(date).toLocaleString()
                          : "Date not available"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${statusColor}`}
                      >
                        <Package className="w-3.5 h-3.5 mr-1.5" />
                        {status}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {itemsCount || 0} item
                        {(itemsCount || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase text-slate-400 tracking-wide">
                        Total amount
                      </p>
                      <p className="font-semibold text-slate-900">
                        {formatEGP(order.totalAmount || order.total || 0)}
                      </p>

                      <p className="text-[11px] uppercase text-slate-400 tracking-wide mt-2">
                        Shipping cost
                      </p>
                      <p className="text-slate-800">
                        {formatEGP(order.shippingCost || 0)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] uppercase text-slate-400 tracking-wide">
                        Payment status
                      </p>
                      <p className="inline-flex items-center gap-1 text-slate-800">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                        <span>{paymentStatus}</span>
                      </p>

                      <p className="text-[11px] uppercase text-slate-400 tracking-wide mt-2">
                        Shipping status
                      </p>
                      <p className="inline-flex items-center gap-1 text-slate-800">
                        <Truck className="w-3.5 h-3.5 text-slate-500" />
                        <span>{shippingStatus}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] uppercase text-slate-400 tracking-wide">
                        Shipping address
                      </p>
                      <p className="text-slate-800 text-sm leading-snug">
                        {order.shippingAddress || "—"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
