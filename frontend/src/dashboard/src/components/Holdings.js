import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Holdings = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchHoldings = async () => {
      const res = await fetch(
        `http://localhost:5000/api/holdings/${user.id}`
      );
      const data = await res.json();
      setHoldings(data);
    };

    fetchHoldings();
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
            </tr>
          </thead>

          <tbody>
            {holdings.map((h) => (
              <tr key={h.id}>
                <td>{h.symbol}</td>
                <td>{h.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Holdings;
