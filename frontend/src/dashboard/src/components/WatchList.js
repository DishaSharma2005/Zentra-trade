import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { apiFetch } from "../../../utils/apiFetch";

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
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await apiFetch(`${API_URL}/api/watchlist/prices`, {
          method: "POST",
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
        toast.error("Please login");
        return;
      }

      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await apiFetch(`${API_URL}/api/orders`, {
          method: "POST",
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
          toast.error(data.error);
          return;
        }

        toast.success(`${type} order placed successfully`);
      } catch (err) {
        console.error("Order failed", err);
        toast.error("Failed to place order");
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
