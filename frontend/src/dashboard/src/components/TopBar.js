import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = ({ onAddFunds }) => {
  const [indices, setIndices] = useState({
    nifty: { points: 0, change: 0 },
    sensex: { points: 0, change: 0 }
  });

  const fetchIndices = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/indices`);
      if (res.ok) {
        const data = await res.json();
        setIndices(data);
      }
    } catch (err) {
      console.error("Failed to fetch indices:", err.message);
    }
  };

  useEffect(() => {
    fetchIndices();
    const intervalId = setInterval(fetchIndices, 10000); // Update every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const renderIndex = (name, data) => {
    const isUp = data.change >= 0;
    return (
      <div className={name.toLowerCase()}>
        <p className="index">{name}</p>
        <p className="index-points">{data.points.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className={`percent ${isUp ? "up" : "down"}`}>
          {isUp ? "+" : ""}{data.change.toFixed(2)}%
        </p>
      </div>
    );
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        {renderIndex("NIFTY 50", indices.nifty)}
        {renderIndex("SENSEX", indices.sensex)}
      </div>

      <Menu onAddFunds={onAddFunds} />
    </div>
  );
};

export default TopBar;
