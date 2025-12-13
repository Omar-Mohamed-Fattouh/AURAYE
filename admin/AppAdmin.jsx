// src/admin/AppAdmin.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../src/components/AdminLayout';
import AdminLanding from './AdminLanding';
import LoginAdmin from '../src/pages/LoginAdmin';
import AdminDashboard from '../src/pages/AdminDashboard';
import AdminProducts from '../src/pages/AdminProducts';
import AdminOrders from '../src/pages/AdminOrders';
import AdminMessages from '../src/pages/AdminMessages';
import AdminNewsletter from '../src/pages/AdminNewsletter';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? <Navigate to="/admin/dashboard" replace /> : children;
};

function AppAdmin() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      {/* Landing Page - First Entry Point */}
      <Route
        index
        element={
          <PublicRoute>
            <AdminLanding />
          </PublicRoute>
        }
      />

      {/* Login Page */}
      <Route
        path="login"
        element={
          <PublicRoute>
            <LoginAdmin />
          </PublicRoute>
        }
      />

      {/* ========== PROTECTED ROUTES (With Sidebar Layout) ========== */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
      </Route>

      {/* ========== FALLBACK ========== */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AppAdmin;