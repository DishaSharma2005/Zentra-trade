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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentTransactions = isMobile 
    ? transactions.slice(indexOfFirstItem, indexOfLastItem)
    : transactions;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            {currentTransactions.map((t) => (
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

      {isMobile && totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <i className="fa fa-chevron-left"></i> Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default Transactions;
