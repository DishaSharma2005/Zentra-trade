import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Summary = () => {
  const { user, loading } = useAuth();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      fetchSummary();
    }
  }, [loading, user]);

  const fetchSummary = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/portfolio/summary/${user.id}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch summary");
    }

    const data = await res.json();
    setBalance(data.currentValue);
  } catch (err) {
    console.error("Summary fetch failed:", err.message);
  }
};


  if (loading) return <p>Loading...</p>;
  if (balance === null) return <p>Loading wallet...</p>;

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <p>Equity</p>

        <div className="data">
          <div className="first">
            <h3>₹{balance}</h3>
            <p>Margin available</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>
            </p>
            <p>
              Opening balance <span>₹{balance}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
