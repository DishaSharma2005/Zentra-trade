import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = ({ onAddFunds }) => {
  return (
    <>
      <TopBar onAddFunds={onAddFunds} />
      <Dashboard onAddFunds={onAddFunds} />
    </>
  );
};

export default Home;
