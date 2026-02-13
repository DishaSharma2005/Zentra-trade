import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Summary = () => {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      fetchSummary();
    }
  }, [loading, user]);

  const fetchSummary = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/summary/${user.id}`
      );

      if (!res.ok) throw new Error("Failed to fetch summary");

      const data = await res.json();
      setSummary(data);

    } catch (err) {
      console.error("Summary fetch failed:", err.message);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!summary) return <p className="loading">Loading portfolio...</p>;

  const {
    totalInvestment,
    currentValue,
    totalPnL,
    totalPnLPercent,
    todayPnL
  } = summary;

  const isProfit = totalPnL >= 0;
  const isTodayProfit = todayPnL >= 0;

  return (
    <div className="summary-container">

      <div className="greeting">
        <h4>Hi, {user?.email?.split("@")[0]} 👋</h4>
      </div>

      <div className="card">

        <div className="main-value">
          <h2>₹ {currentValue?.toLocaleString()}</h2>
          <p>Current Portfolio Value</p>
        </div>

        <div className="pnl-section">
          <div>
            <span>Total Investment</span>
            <h4>₹ {totalInvestment?.toLocaleString()}</h4>
          </div>

          <div>
            <span>Total P&L</span>
            <h4 className={isProfit ? "profit" : "loss"}>
              ₹ {totalPnL?.toLocaleString()} ({totalPnLPercent?.toFixed(2)}%)
            </h4>
          </div>

          <div>
            <span>Today's P&L</span>
            <h4 className={isTodayProfit ? "profit" : "loss"}>
              ₹ {todayPnL?.toLocaleString()}
            </h4>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Summary;
