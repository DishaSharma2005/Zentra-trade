import React, { useState } from "react";
import { watchlist } from "../data/data";
import { useAuth } from "../../../context/AuthContext";


const WatchList = () => {
  const { user } = useAuth();

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty"
          className="search"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => (
          <WatchListItem
            stock={stock}
            key={index}
            user={user}   // ✅ PASS HERE
          />
        ))}
      </ul>
    </div>
  );
};

const WatchListItem = ({ stock, user }) => {
  const [showActions, setShowActions] = useState(false);
  const placeOrder = async (type) => {
  if (!user) {
    alert("Please login");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        symbol: stock.name,   // INFY
        qty: 1,               // start simple
        price: stock.price,   // from watchlist
        type,                 // BUY or SELL
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert(`${type} order placed`);
  } catch (err) {
    console.error("Order failed", err);
  }
};


  return (
    <li
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>

        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          <span className="price">{stock.price}</span>
        </div>
      </div>

      {showActions && (
        <div className="actions">
          <button className="buy" onClick={() => placeOrder("BUY")}>
            Buy
          </button>

          <button className="sell" onClick={() => placeOrder("SELL")}>
            Sell
          </button>

          <button className="action">📊</button>
          <button className="action">⋯</button>
        </div>
      )}
    </li>
  );
};

export default WatchList;
