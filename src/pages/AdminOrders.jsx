// src/admin/pages/AdminOrders.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, Trash2, X, Calendar, Package, 
  ChevronDown, CreditCard, Banknote, MapPin 
} from 'lucide-react';
import AdminPanelApi from '../api/AdminPanelApi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await AdminPanelApi.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await AdminPanelApi.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this order permanently?')) return;
    try {
      await AdminPanelApi.deleteOrder(orderId);
      setOrders(orders.filter(o => o.orderId !== orderId));
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderId?.toString().includes(search) ||
      o.recipientName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Processing: 'bg-blue-50 text-blue-700 border-blue-200',
      Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
      Cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const OrderCard = ({ order }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="font-bold text-gray-900">#{order.orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Date</p>
          <p className="text-sm font-medium text-gray-700">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="font-semibold text-gray-900">{order.recipientName || 'Guest'}</p>
        <p className="text-sm text-gray-500">{order.contactEmail}</p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            {order.totalAmount?.toLocaleString()} EGP
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            order.paymentStatus === 'Paid' || order.paymentStatus === 'Succeeded'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-orange-50 text-orange-700 border-orange-200'
          }`}>
            {order.paymentStatus || 'Pending'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(order.status)}`}
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedOrder(order);
            setShowModal(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Eye size={16} /> View
        </button>
        <button
          onClick={() => handleDelete(order.orderId)}
          className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <p className="text-gray-500 mt-1">{filteredOrders.length} orders found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 sm:w-48"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-4" />
              <div className="h-6 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </motion.div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Order #{selectedOrder.orderId}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Customer</h4>
                  <p className="font-bold text-gray-900 mb-1">{selectedOrder.recipientName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.contactEmail}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.contactPhone}</p>
                </div>

                {/* Shipping Address */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Shipping Address</h4>
                  <p className="text-gray-700">{selectedOrder.shippingAddress || 'N/A'}</p>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Items</h4>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} • Color: {item.selectedColor}</p>
                      </div>
                      <p className="font-bold text-gray-900">{item.unitPrice} EGP</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">
                    {selectedOrder.totalAmount?.toLocaleString()} EGP
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;