import React from "react";
import { Route, Routes } from "react-router-dom";
import "../index.css";
import TopBar from "./TopBar";
import Apps from "./Apps";

import Holdings from "./Holdings";
import Orders from "./Orders";
import Transactions from "./Transactions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import PaymentSuccess from "./payments/PaymentSuccess";
import PaymentCancel from "./payments/PaymentCancel";

const Dashboard = ({ onAddFunds }) => {
  return (
    <>
    {/* <TopBar />   */}
    <div className="dashboard-container">
      <WatchList />

      <div className="content">
        <Routes>
          <Route index element={<Summary />} />
          <Route path="orders" element={<Orders />} />
          <Route path="holdings" element={<Holdings />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="wallet-success" element={<PaymentSuccess />} />
          <Route path="wallet-cancel" element={<PaymentCancel />} />
          <Route path="apps" element={<Apps />} />

        </Routes>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
