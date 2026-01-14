import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import HomePage from "./landing_page/home/HomePage";
import SignUp from "./auth/signup";
import Login from "./auth/Login";
import About from "./landing_page/about/About";
import Pricing from "./landing_page/pricing/Pricing";
import Product from "./landing_page/products/Product";
import Support from "./landing_page/support/Support";
import Footer from "./landing_page/Footer";
import Navbar from "./landing_page/Navbar";
import NotFound from "./landing_page/NotFound";

import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardHome from "./dashboard/src/components/Home";

import { AuthProvider } from "./context/AuthContext";

/* ✅ LAYOUT HANDLER */
function AppLayout() {
  const location = useLocation();

  // hide landing navbar/footer on dashboard
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* LANDING */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/support" element={<Support />} />

        {/* DASHBOARD (PROTECTED) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  </BrowserRouter>
);
