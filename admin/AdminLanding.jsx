// src/admin/pages/AdminLanding.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, ArrowRight, Sparkles, Lock, 
  BarChart3, ShoppingBag, Zap 
} from 'lucide-react';
import { useEffect } from 'react';

const AdminLanding = () => {
  const navigate = useNavigate();

  // ✅ إذا كان مسجل دخول بالفعل، روح Dashboard مباشرة
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Monitor sales, orders, and customer behavior instantly'
    },
    {
      icon: ShoppingBag,
      title: 'Order Management',
      description: 'Track and manage orders from a unified dashboard'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern tech for optimal performance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <Shield className="text-emerald-400" size={20} />
              <span className="font-bold text-sm tracking-wider">ADMIN PORTAL</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              AURAYE
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-300 tracking-wide">
              Management System
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-400 text-lg mb-12 max-w-2xl mx-auto"
          >
            Your centralized hub for managing products, orders, customers, and analytics. 
            Built for efficiency and powered by modern technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={() => navigate('/admin/login')}
              className="group relative px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Sign In
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Back to Store
            </button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="mb-4 p-3 bg-white/10 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <feature.icon size={28} className="text-emerald-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <Lock size={14} />
              <span>Secured with enterprise-grade encryption</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 opacity-20">
        <Sparkles size={80} className="text-emerald-400 animate-pulse" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20">
        <Sparkles size={60} className="text-blue-400 animate-pulse delay-500" />
      </div>
    </div>
  );
};

export default AdminLanding;