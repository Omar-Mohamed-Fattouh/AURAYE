// src/admin/components/StatCard.jsx
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'gray',
  onClick,
  loading = false 
}) => {
  const colorClasses = {
    gray: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  };

  const colors = colorClasses[color] || colorClasses.gray;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border ${colors.border} shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-5">
        <div className={`w-full h-full rounded-full ${colors.bg}`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {title}
            </p>
            
            {loading ? (
              <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                {value}
              </h3>
            )}
            
            {subtitle && (
              <p className="text-xs text-gray-400 mt-2 font-medium">{subtitle}</p>
            )}
          </div>

          <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform`}>
            <Icon size={24} className={colors.text} />
          </div>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              trend.direction === 'up' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {trend.direction === 'up' ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
              <span>{trend.value}%</span>
            </div>
            <span className="text-xs text-gray-500">vs last {trend.period || 'month'}</span>
          </div>
        )}
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default StatCard;