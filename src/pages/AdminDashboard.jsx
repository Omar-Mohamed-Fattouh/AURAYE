// src/admin/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, ShoppingBag, DollarSign, Package, 
  Users, AlertCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import AdminPanelApi from '../api/AdminPanelApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await AdminPanelApi.getDashboardStats();
      processStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processStats = ({ orders, products, messages }) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Revenue calculation
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const dailyRevenue = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      amount: 0,
    }));

    orders.forEach((order) => {
      if (order.paymentStatus === 'Paid' || order.paymentStatus === 'Succeeded') {
        totalRevenue += order.totalAmount;
        const orderDate = new Date(order.createdAt);
        if (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        ) {
          monthlyRevenue += order.totalAmount;
          const day = orderDate.getDate();
          if (day <= 30) dailyRevenue[day - 1].amount += order.totalAmount;
        }
      }
    });

    // Order status breakdown
    const statusBreakdown = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (statusBreakdown[o.status] !== undefined) statusBreakdown[o.status]++;
    });

    // Low stock products
    const lowStock = products.filter((p) => p.stockQuantity < 10).slice(0, 5);

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setStats({
      totalRevenue,
      monthlyRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders: statusBreakdown.Pending,
      unreadMessages: messages.filter((m) => m.status !== 'Replied').length,
      dailyRevenue,
      statusBreakdown: Object.entries(statusBreakdown).map(([name, value]) => ({
        name,
        value,
      })),
      lowStock,
      recentOrders,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'gray' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {trend.direction === 'up' ? (
            <ArrowUp size={16} className="text-green-600" />
          ) : (
            <ArrowDown size={16} className="text-red-600" />
          )}
          <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend.value}%
          </span>
          <span className="text-gray-500">vs last month</span>
        </div>
      )}
    </motion.div>
  );

  const COLORS = {
    Pending: '#F59E0B',
    Processing: '#3B82F6',
    Shipped: '#8B5CF6',
    Delivered: '#10B981',
    Cancelled: '#EF4444',
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h2>
        <p className="text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`${stats.monthlyRevenue.toLocaleString()} EGP`}
          subtitle="This month"
          icon={DollarSign}
          color="green"
          trend={{ direction: 'up', value: 12 }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle="All time"
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          subtitle="In inventory"
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Needs attention"
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="amount" fill="#111827" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.statusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.statusBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            Low Stock Alert
          </h3>
          {stats.lowStock.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStock.map((p) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                    <p className="text-xs text-gray-500">ID: {p.productId}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {p.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">All products well stocked! 🎉</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Order #{order.orderId}
                    </p>
                    <p className="text-xs text-gray-500">{order.recipientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      {order.totalAmount.toLocaleString()} EGP
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;