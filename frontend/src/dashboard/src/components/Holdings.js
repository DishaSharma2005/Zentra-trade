import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../utils/apiFetch";

const Holdings = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    let timeoutId;
    let isMounted = true;

    const pollHoldings = async () => {
      if (!isMounted) return;
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await apiFetch(
          `${API_URL}/api/holdings/${user.id}`
        );
        if (res && res.ok) {
          const data = await res.json();
          if (isMounted) setHoldings(data);
        }
      } catch (e) {
        console.error("Failed to fetch holdings", e);
      }
      
      if (isMounted) {
        timeoutId = setTimeout(pollHoldings, 3000); // Poll every 3 seconds for fast UI updates after BUY
      }
    };

    pollHoldings();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(holdings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentHoldings = isMobile 
    ? holdings.slice(indexOfFirstItem, indexOfLastItem)
    : holdings;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            {currentHoldings.map((h) => (
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

export default Holdings;
