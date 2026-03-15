import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "../index.css";


import Holdings from "./Holdings";
import Orders from "./Orders";
import Transactions from "./Transactions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import FundsHistory from "./FundsHistory";
import PaymentSuccess from "./payments/PaymentSuccess";
import PaymentCancel from "./payments/PaymentCancel";

const Dashboard = ({ onAddFunds }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSummaryPage = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  
  // Show watchlist if it's NOT mobile (Desktop view) OR if it's the main summary page
  const shouldShowWatchlist = !isMobile || isSummaryPage;

  return (
    <>
    {/* <TopBar />   */}
    <div className="dashboard-container">
      {shouldShowWatchlist && <WatchList />}

      <div className="content">
        <Routes>
          <Route index element={<Summary />} />
          <Route path="orders" element={<Orders />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="funds" element={<FundsHistory />} />
          <Route path="wallet-success" element={<PaymentSuccess />} />
          <Route path="wallet-cancel" element={<PaymentCancel />} />
         
        </Routes>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
