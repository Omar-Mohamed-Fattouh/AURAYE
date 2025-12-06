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
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import ProtectedRoute from "../features/auth/ProtectedRoute";

// Shop Pages
import Products from "../pages/Products.jsx";
import Cart from "../pages/Cart.jsx";
import Checkout from "../pages/Checkout.jsx";
import Success from "../pages/Success.jsx";
import StripePage from "../pages/StripePage.jsx";
import Home from "../pages/Home.jsx";

// Layout
import Layout from "../components/Layout.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
// import ProductDetails from "../components/ProductDetails.jsx";
import Contact from "../pages/Contact.jsx";
import ShippingInfo from "../pages/ShippingInfo.jsx";
import ProductID from "../pages/ProductID.jsx";
// import MenProduct from "../components/MenProduct.jsx";
import MenPage from "../pages/MenPage.jsx";
import WomenPage from "../pages/WomenPage.jsx";
import EyeGlassesPage from "../pages/EyeGlassesPage.jsx";
import SunGlassesPage from "../pages/SunGlassesPage.jsx";
import ColorsPage from "../pages/ColorPages.jsx";
import FramesPage from "../pages/FramesPage.jsx";
import ShapesPage from "../pages/ShapesPage.jsx";
import AllProductPage from "../pages/AllProductPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import Profile from "../pages/Profile.jsx";
import FAQ from "../pages/FAQ.jsx";
import About from "../pages/About.jsx";
import Mission from "../pages/Mission.jsx";
import WhyUS from "../pages/WhyUS.jsx";
import TeamPgae from "../pages/TeamPgae.jsx";

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
              <ScrollToTop />

          <Routes>
            {/* Auth routes (no layout) */}
            <Route element={<Layout user={user} setUser={setUser} />}>
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
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              {/* Routes with Layout */}
              <Route path="/" element={<Home />} />
              <Route
                path="/dashboard"
                element={<Dashboard user={user} setUser={setUser} />}
              />
              <Route path="/products" element={<AllProductPage />} />
              <Route path="products/men" element={<MenPage />} />
              <Route path="/products/women" element={<WomenPage />} />
              <Route path="/products/sunglasses" element={<SunGlassesPage />} />
              <Route path="/products/eyeglasses" element={<EyeGlassesPage />} />
              <Route path="/products/shapes" element={<ShapesPage />} />
              <Route path="/products/frames" element={<FramesPage />} />
              <Route path="/products/colors" element={<ColorsPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="shipping" element={<ShippingInfo />} />
              <Route path="/products/:id" element={<ProductID />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/why-us" element={<WhyUS />} />
              <Route path="/team" element={<TeamPgae />} />
              <Route path="/profile"
                element={
                  <ProtectedRoute user={user}>
                    <Profile user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute user={user}>
                    <WishlistPage />
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

              {/* Catch-all inside Layout */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
                
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}
