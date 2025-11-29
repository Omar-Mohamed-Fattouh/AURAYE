import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "../store/cartContext.jsx";
import { Toaster } from "sonner";

// Auth Pages
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";

// Shop Pages
import Products from "../pages/Products.jsx";
import Cart from "../pages/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import Success from "../pages/Success.jsx";
// Components
import Navbar from "../components/Navbar";
import StripePage from "../pages/StripePage.jsx";
import Home from "../pages/Home.jsx";
const queryClient = new QueryClient();
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY ||
    "pk_test_51SNKAoGzvbRhjQvPR3JEkeBuGMY4OaENFmTO7Migi53sKdAYtCu9rFAqVoJp0RMNrlyn2ePHloeAKb7Njp4HJBpj00f0fercjZ"
);

export default function AppRouter() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Toaster />
        <BrowserRouter>
          <Navbar user={user} setUser={setUser} />

          <Routes>
            {/* Auth Routes */}
            <Route
              path="/register"
              element={
                !user ? (
                  <Register setUser={setUser} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/login"
              element={
                !user ? (
                  <Login setUser={setUser} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard user={user} setUser={setUser} />
                </ProtectedRoute>
              }
            />

            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Shop / Payment Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute user={user}>
                  <Products />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute user={user}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute user={user}>
                  <Checkout stripePromise={stripePromise} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/success"
              element={
                <ProtectedRoute user={user}>
                  <Success />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stripe"
              element={
                <ProtectedRoute user={user}>
                  <StripePage stripePromise={stripePromise} />
                </ProtectedRoute>
              }
            />
            {/* Catch-all */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}
