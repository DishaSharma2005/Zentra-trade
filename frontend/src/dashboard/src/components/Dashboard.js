import React from "react";
import { Route, Routes } from "react-router-dom";
import "../index.css";
import TopBar from "./TopBar";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";

const Dashboard = () => {
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
          <Route path="positions" element={<Positions />} />
          <Route path="funds" element={<Funds />} />
          <Route path="apps" element={<Apps />} />

        </Routes>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
