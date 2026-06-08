import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import HomePage        from "../Pages/HomePage";
import About           from "../Pages/About";
import Adoption        from "../Pages/Adoption";
import Contact         from "../Pages/Contact";
import FAQ             from "../Pages/FAQ";
import ForgotPassword  from "../Pages/ForgotPassword";
import Login           from "../Pages/Login";
import Signup          from "../Pages/Signup";
import Enquiry         from "../Pages/Enquiry";
import Application     from "../Pages/Application";
import AdminDashboard  from "../Pages/AdminDashboard";
import PetShopAdd      from "../Pages/PetShopAdd";
import Privacy         from "../Pages/Privacy";
import Seller          from "../Pages/Seller";
import Terms           from "../Pages/Terms";
import NotFound        from "../Pages/NotFound";
import CartPage        from "../Pages/CartPage";
import PetDetail       from "../Pages/PetDetail";
import OrderHistory    from "../Pages/OrderHistory";
import Wishlist        from "../Pages/Wishlist";
import SellerDashboard from "../Pages/SellerDashboard";
import MyPets          from "../Pages/MyPets";

// Route guard — redirects unauthenticated users to login
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null; // wait for auth state to load
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole && !(requiredRole === "seller" && user?.role === "admin")) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"               element={<HomePage />} />
      <Route path="/about"          element={<About />} />
      <Route path="/adoption"       element={<Adoption />} />
      <Route path="/pets/:id"       element={<PetDetail />} />
      <Route path="/contact"        element={<Contact />} />
      <Route path="/faq"            element={<FAQ />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/signup"         element={<Signup />} />
      <Route path="/enquiry"        element={<Enquiry />} />
      <Route path="/application"    element={<Application />} />
      <Route path="/shop"           element={<PetShopAdd />} />
      <Route path="/privacy"        element={<Privacy />} />
      <Route path="/seller"         element={<Seller />} />
      <Route path="/terms"          element={<Terms />} />
      <Route path="/cart"           element={<CartPage />} />

      {/* Protected — any authenticated user */}
      <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/wishlist"      element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      <Route path="/my-pets"       element={<ProtectedRoute><MyPets /></ProtectedRoute>} />

      {/* Protected — seller only */}
      <Route path="/seller/dashboard" element={
        <ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute>
      } />

      {/* Protected — admin only */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;