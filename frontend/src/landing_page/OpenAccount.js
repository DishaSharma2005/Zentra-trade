import React from "react";

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
      <button className="btn btn-primary btn-lg px-5">
        Sign Up Now
      </button>
    </div>
  );
}

export default OpenAccount;
