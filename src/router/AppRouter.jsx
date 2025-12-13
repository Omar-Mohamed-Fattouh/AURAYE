import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "../store/cartContext.jsx";
import { Toaster } from "sonner";
import { AuthContext } from "../features/auth/AuthContext";

import RouteWithTitle from "./RouteWithTitle.jsx";

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
import Contact from "../pages/Contact.jsx";
import ShippingInfo from "../pages/ShippingInfo.jsx";
import ProductID from "../pages/ProductID.jsx";
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
import ArTry from "../pages/Ar-try.jsx";
import TryAr from "../pages/TryAr.jsx";

const queryClient = new QueryClient();
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY ||
    "pk_test_51SNKAoGzvbRhjQvPR3JEkeBuGMY4OaENFmTO7Migi53sKdAYtCu9rFAqVoJp0RMNrlyn2ePHloeAKb7Njp4HJBpj00f0fercjZ"
);

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token || !!storedUser);
  }, [setIsLoggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            <Route element={<Layout user={user} setUser={setUser} />}>

              {/* Auth */}
              <Route
                path="/login"
                element={
                  <RouteWithTitle title="Login">
                    {!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
                  </RouteWithTitle>
                }
              />

              <Route
                path="/register"
                element={
                  <RouteWithTitle title="Register">
                    {!isLoggedIn ? <Register /> : <Navigate to="/" replace />}
                  </RouteWithTitle>
                }
              />

              <Route
                path="/forget-password"
                element={
                  <RouteWithTitle title="Forget Password">
                    <ForgetPassword />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/reset-password/:token"
                element={
                  <RouteWithTitle title="Reset Password">
                    <ResetPassword />
                  </RouteWithTitle>
                }
              />

              {/* Main Pages */}
              <Route
                path="/"
                element={
                  <RouteWithTitle title="Home">
                    <Home />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <RouteWithTitle title="Dashboard">
                    <Dashboard />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products"
                element={
                  <RouteWithTitle title="Products">
                    <AllProductPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/men"
                element={
                  <RouteWithTitle title="Men Products">
                    <MenPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/women"
                element={
                  <RouteWithTitle title="Women Products">
                    <WomenPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/sunglasses"
                element={
                  <RouteWithTitle title="Sunglasses">
                    <SunGlassesPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/eyeglasses"
                element={
                  <RouteWithTitle title="Eyeglasses">
                    <EyeGlassesPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/shapes"
                element={
                  <RouteWithTitle title="Shapes">
                    <ShapesPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/frames"
                element={
                  <RouteWithTitle title="Frames">
                    <FramesPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/colors"
                element={
                  <RouteWithTitle title="Colors">
                    <ColorsPage />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/products/:id"
                element={
                  <RouteWithTitle title="Product Details">
                    <ProductID />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/contact"
                element={
                  <RouteWithTitle title="Contact">
                    <Contact />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/shipping"
                element={
                  <RouteWithTitle title="Shipping Info">
                    <ShippingInfo />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/cart"
                element={
                  <RouteWithTitle title="Cart">
                    <Cart />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/faq"
                element={
                  <RouteWithTitle title="FAQ">
                    <FAQ />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/about"
                element={
                  <RouteWithTitle title="About Us">
                    <About />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/mission"
                element={
                  <RouteWithTitle title="Mission">
                    <Mission />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/why-us"
                element={
                  <RouteWithTitle title="Why Us">
                    <WhyUS />
                  </RouteWithTitle>
                }
              />

              <Route
                path="/team"
                element={
                  <RouteWithTitle title="Team">
                    <TeamPgae />
                  </RouteWithTitle>
                }
              />
              <Route 
              path="try"
              element={
                <RouteWithTitle title="AR-TryOn">
                  <ArTry/>
                </RouteWithTitle>
              }
              />
              <Route 
              path="devices"
              element={
                <RouteWithTitle title="devices">
                  <TryAr/>
                </RouteWithTitle>
              }></Route>

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <RouteWithTitle title="Profile">
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </RouteWithTitle>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <RouteWithTitle title="Wishlist">
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  </RouteWithTitle>
                }
              />

              <Route
                path="/checkout"
                element={
                  <RouteWithTitle title="Checkout">
                    <ProtectedRoute>
                      <Checkout stripePromise={stripePromise} />
                    </ProtectedRoute>
                  </RouteWithTitle>
                }
              />

              <Route
                path="/success"
                element={
                  <RouteWithTitle title="Order Success">
                    <ProtectedRoute>
                      <Success />
                    </ProtectedRoute>
                  </RouteWithTitle>
                }
              />

              <Route
                path="/stripe"
                element={
                  <RouteWithTitle title="Stripe Payment">
                    <ProtectedRoute>
                      <StripePage stripePromise={stripePromise} />
                    </ProtectedRoute>
                  </RouteWithTitle>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <RouteWithTitle title="Not Found">
                    <NotFoundPage />
                  </RouteWithTitle>
                }
              />

            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}
