import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const FundsHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/payments/history/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch fund history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="history-container"><p>Loading history...</p></div>;

  return (
    <div className="history-container">
      <div className="orders-header">
        <h3 className="title">Funds History ({history.length})</h3>
        <button onClick={fetchHistory} className="btn btn-blue">🔄 Refresh</button>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td className="align-left">
                  {(() => {
                    const date = new Date(item.created_at);
                    return date.toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    });
                  })()}
                </td>
                <td className="order-timestamp">
                  {item.stripe_session_id.substring(0, 16)}...
                </td>
                <td>
                  <span className="badge-completed">✓ SUCCESS</span>
                </td>
                <td className="profit" style={{ fontWeight: 600 }}>
                  + ₹{item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <i className="fa fa-chevron-left"></i> Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}

      {history.length === 0 && (
        <div className="no-orders">
          <p>No fund additions found.</p>
        </div>
      )}
    </div>
  );
};

export default FundsHistory;
