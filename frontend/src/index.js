import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
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

/*  LAYOUT HANDLER */
import AddFundsModal from "./dashboard/src/components/AddFundsModal";

function AppLayout() {
  const location = useLocation();
  const [showAddFunds, setShowAddFunds] = React.useState(false);

  // hide landing navbar/footer on dashboard (modal will show only inside dashboard)
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const openAddFunds = () => setShowAddFunds(true);
  const closeAddFunds = () => setShowAddFunds(false);

  //  Warmup ping — wakes the Render backend on first site visit
  // so it's ready by the time the user needs real API calls.
  React.useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    fetch(`${API_URL}/health`).catch(() => {}); // silent — never affects UI
  }, []);

  return (
    <>
      {!isDashboardRoute && <Navbar onAddFunds={openAddFunds} />}

      <Routes>
        {/* LANDING */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/product" element={<Product />} />
        <Route path="/support" element={<Support />} />
        {/* payment callbacks outside dashboard are no longer needed */}

        {/* DASHBOARD (PROTECTED) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardHome onAddFunds={openAddFunds} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isDashboardRoute && <Footer />}

      {/* add funds modal rendered when requested */}
      {showAddFunds && (
        <AddFundsModal onClose={closeAddFunds} />
      )}
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
