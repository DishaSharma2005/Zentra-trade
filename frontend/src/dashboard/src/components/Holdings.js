import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Holdings = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchHoldings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/holdings/${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setHoldings(data);
        }
      } catch (e) {
        console.error("Failed to fetch holdings", e);
      }
    };

    fetchHoldings();
    const intervalId = setInterval(fetchHoldings, 3000);
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
               <th>Avg</th>
                <th>LTP</th>
                <th>Invested</th>
                <th>Current</th>
                <th>P&L</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((h) => (
              <tr key={h.id}>
                <td>{h.symbol}</td>
                <td>{h.quantity}</td>
                <td>₹{Number(h.avg_price).toFixed(2)}</td>

                <td>₹{h.current_price}</td>
                <td>₹{h.invested.toFixed(2)}</td>
                <td>₹{h.current.toFixed(2)}</td>
                <td
                  style={{
                    color: h.pnl > 0 ? "green" : h.pnl < 0 ? "red" : "inherit",
                    fontWeight: 600,
                  }}
                >
                  {h.pnl > 0 ? "+" : ""}₹{h.pnl.toFixed(2)} ({h.pnl > 0 ? "+" : ""}{h.pnlPercent}%)
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
};

export default Holdings;
