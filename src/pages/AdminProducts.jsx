// src/admin/pages/AdminProducts.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Pencil, Trash2, Image as ImageIcon, 
  Eye, X, Package, AlertCircle, Filter, Box
} from 'lucide-react';
import AdminPanelApi from '../api/AdminPanelApi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [arProducts, setArProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | standard | ar
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [standard, ar] = await Promise.all([
        AdminPanelApi.getAllProducts(),
        AdminPanelApi.getArProducts()
      ]);
      setProducts(standard.data || []);
      setArProducts(ar.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await AdminPanelApi.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const allProducts = [...products, ...arProducts];
  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'ar') return matchesSearch && arProducts.includes(p);
    if (filter === 'standard') return matchesSearch && products.includes(p);
    return matchesSearch;
  });

  const ProductCard = ({ product, isAr }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl border ${isAr ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-gray-200'} p-4 hover:shadow-lg transition-all group`}
    >
      {/* Image */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-50 aspect-square">
        {isAr && (
          <div className="absolute top-2 right-2 z-10 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Box size={12} /> AR
          </div>
        )}
        <img 
          src={"https://graduationproject11.runasp.net"+product.defaultImgUrl || 'https://placehold.co/400x400?text=No+Image'} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 truncate">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-gray-900">
            {product.price?.toLocaleString() || 0} EGP
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            product.stockQuantity > 10 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {product.stockQuantity || 0} in stock
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => {
            setCurrentProduct(product);
            setShowModal(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Pencil size={16} /> Edit
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
          <ImageIcon size={16} /> Media
        </button>
        <button
          onClick={() => handleDelete(product.productId)}
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products Inventory</h2>
          <p className="text-gray-500 mt-1">{filteredProducts.length} products found</p>
        </div>
        <button 
          onClick={() => {
            setCurrentProduct(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent sm:w-48"
        >
          <option value="all">All Products</option>
          <option value="standard">Standard Only</option>
          <option value="ar">AR Enabled Only</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.productId} 
                product={product} 
                isAr={arProducts.includes(product)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Edit Modal - Placeholder */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {currentProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-500 text-center py-12">
                Form implementation goes here...
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;