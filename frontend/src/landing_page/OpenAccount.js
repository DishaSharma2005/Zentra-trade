import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container text-center py-5 my-5">
  
      {/* Text Section */}
      <h1 className="fw-semibold mt-4">Open a Zerodha Account</h1>
      <p className="text-muted mb-4 fs-5">
        Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
        F&O trades.
      </p>

      {/* Button Section */}
      <Link to="/signup" className="btn btn-primary btn-lg px-5">
        Sign Up Now
      </Link>
    </div>
  );
}

export default OpenAccount;
