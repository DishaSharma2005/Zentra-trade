import React, { useState, useEffect } from "react";
import Menu from "./Menu";

const TopBar = ({ onAddFunds }) => {
  const [indices, setIndices] = useState({
    nifty: { points: 0, change: 0 },
    sensex: { points: 0, change: 0 }
  });

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const pollIndices = async () => {
      if (!isMounted) return;
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/indices`);

        if (res && res.ok) {
          const data = await res.json();
          if (isMounted) setIndices(data);
        }
      } catch (err) {
        console.error("Failed to fetch indices:", err.message);
      }

      if (isMounted) {
        timeoutId = setTimeout(pollIndices, 15000); // 15 seconds
      }
    };

    pollIndices();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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
        {renderIndex("NIFTY 50 ", indices.nifty)}
        {renderIndex("SENSEX", indices.sensex)}
      </div>

      <Menu onAddFunds={onAddFunds} />
    </div>
  );
};

export default TopBar;
