import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard/summary");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-result-container">
      <h2>Payment Cancelled</h2>
      <p>You have cancelled the transaction.</p>
      <p>Redirecting to dashboard summary...</p>
    </div>
  );
};

export default PaymentCancel;
