import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import ChatBot from "../../../ChatBot/ChatBot";
import { useAuth } from "../../../context/AuthContext";
import { Toaster } from "react-hot-toast";

const Home = ({ onAddFunds }) => {
   const { user } = useAuth();
  return (
    <>
     <Toaster position="top-center" />
      <TopBar onAddFunds={onAddFunds} />
      <Dashboard onAddFunds={onAddFunds} />
      <ChatBot userId={user?.id} />
    </>
  );
};

export default Home;
