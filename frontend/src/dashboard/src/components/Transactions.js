import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/transactions/${user.id}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Transaction fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <>
      <h3 className="title">Transactions ({transactions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th>P&L</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>
                  {new Date(t.created_at).toLocaleDateString()}
                </td>

                <td>{t.symbol}</td>

                <td className={t.type === "BUY" ? "up" : "down"}>
                  {t.type}
                </td>

                <td>{t.quantity}</td>

                <td>₹{t.price}</td>

                <td>₹{t.total_value}</td>

                <td
                  className={
                    t.realized_pnl !== null && t.realized_pnl > 0
                      ? "up"
                      : t.realized_pnl !== null && t.realized_pnl < 0
                      ? "down"
                      : ""
                  }
                >
                  {t.realized_pnl !== null && t.realized_pnl !== undefined
                    ? `₹${t.realized_pnl.toFixed(2)}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Transactions;
