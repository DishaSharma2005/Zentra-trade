import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../utils/apiFetch";

const Summary = () => {
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const pollSummary = async () => {
      if (!isMounted || loading || !user) return;
      
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await apiFetch(`${API_URL}/api/user/summary/${user.id}`);
        if (res && res.ok) {
          const data = await res.json();
          if (isMounted) setSummary(data);
        }
      } catch (err) {
        console.error("Summary fetch failed:", err.message);
      }

      if (isMounted) {
        timeoutId = setTimeout(pollSummary, 3000); // Poll every 3 seconds
      }
    };

    if (!loading && user) {
      pollSummary();
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [loading, user]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!summary) return <p className="loading">Loading portfolio...</p>;

  const {
    wallet,
    totalInvestment,
    currentValue,
    totalPnL,
    totalPnLPercent,
    todayPnL,
  } = summary;

  const pnlClass = totalPnL > 0 ? "profit" : totalPnL < 0 ? "loss" : "";
  const todayPnlClass = todayPnL > 0 ? "profit" : todayPnL < 0 ? "loss" : "";

  return (
    <div className="summary-container">
      <div className="greeting">
        <h4>Hi, {user?.email?.split("@")[0]} 👋</h4>
        {wallet && (
          <p className="wallet-balance">
            Wallet: ₹ {wallet.balance?.toLocaleString()}
          </p>
        )}
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
            <h4 className={pnlClass}>
              {totalPnL > 0 ? "+" : ""}₹ {totalPnL?.toLocaleString()} (
              {totalPnL > 0 ? "+" : ""}
              {totalPnLPercent?.toFixed(2)}%)
            </h4>
          </div>

          <div>
            <span>Today's P&L</span>
            <h4 className={todayPnlClass}>
              {todayPnL > 0 ? "+" : ""}₹ {todayPnL?.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
