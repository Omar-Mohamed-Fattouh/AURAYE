// src/admin/components/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Mail, Megaphone, 
  User, LogOut, Menu, X, ChevronLeft, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanelApi from '../api/AdminPanelApi';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await AdminPanelApi.getProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/messages', label: 'Messages', icon: Mail },
    { path: '/admin/newsletter', label: 'Newsletter', icon: Megaphone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col bg-white border-r border-gray-200 fixed h-screen z-30"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black tracking-wider text-gray-900"
            >
              AURAYE
            </motion.span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft
              className={`transform transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`}
              size={20}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                {user?.fullName?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.fullName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                {user?.fullName?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-screen w-72 bg-white z-50 shadow-2xl lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                <span className="text-xl font-black tracking-wider text-gray-900">
                  AURAYE
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="py-4 px-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'
        }`}
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-gray-900">
              {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm lg:hidden">
              {user?.fullName?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;