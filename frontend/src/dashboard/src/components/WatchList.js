import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const WatchList = () => {
  const { user } = useAuth();

  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const symbols = [
    "INFY",
    "ONGC",
    "TCS",
    "KPITTECH",
    "QUICKHEAL",
    "WIPRO",
    "RELIANCE",
    "HUL"
    // removed M&M because & can break API
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/watchlist/prices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbols }),
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setWatchlist(data);
        } else if (Array.isArray(data.data)) {
          setWatchlist(data.data);
        } else {
          console.error("Invalid watchlist response:", data);
          setWatchlist([]);
        }

      } catch (err) {
        console.error("Failed to load watchlist", err);
        setWatchlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

const WatchListItem = ({ stock }) => {
    const [showActions, setShowActions] = useState(false);

    const placeOrder = async (type) => {
      if (!user) {
        alert("Please login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            symbol: stock.name,
            qty: 1,
            price: stock.price,
            type,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error);
          return;
        }

        alert(`${type} order placed successfully`);
      } catch (err) {
        console.error("Order failed", err);
      }
    };

    return (
      <li
        className="watchlist-item"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="item">
          <span className="symbol">{stock.name}</span>
          <div className="right">
            <span className={`percent ${stock.isDown ? "down" : "up"}`}>
              {stock.percent}
            </span>
            <span className="price">₹ {stock.price}</span>
          </div>
          {showActions && (
            <div className="actions">
              <span>
                <button className="buy" onClick={() => placeOrder("BUY")}>
                  Buy
                </button>
                <button className="sell" onClick={() => placeOrder("SELL")}>
                  Sell
                </button>
              </span>
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="watchlist-container">
      <div className="header">
        <h3>Market Watchlist</h3>
        <span>{watchlist.length} / 50</span>
      </div>

      {loading ? (
        <div className="loading">
          <p>Loading prices...</p>
        </div>
      ) : (
        <ul className="list">
          {watchlist.length > 0 ? (
            watchlist.map((stock) => (
              <WatchListItem key={stock.name} stock={stock} />
            ))
          ) : (
            <div className="loading">
              <p>No stocks available</p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default WatchList;
