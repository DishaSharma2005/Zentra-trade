import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// optional verify via backend if webhook is not yet active
const verifySession = async (sessionId) => {
  try {
    // Fallback to localhost if env var is not set
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const res = await fetch((`${API_URL}/api/payments/verify-session`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("verifySession error", err);
    return null;
  }
};

const PaymentSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("No session id found in url.");
      return;
    }

    // in production, rely on webhook; this is optional fallback
    verifySession(sessionId).then((data) => {
      if (data && data.success) {
        setStatus("Payment verified and wallet updated!");
      } else {
        setStatus("Unable to verify payment. Please contact support.");
      }
    });

    // redirect to dashboard after a few seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [search, navigate]);

  return (
    <div className="payment-result-container">
      <h2>Payment Successful 🎉</h2>
      <p>{status}</p>
      <p>Redirecting to summary page...</p>
    </div>
  );
};

export default PaymentSuccess;
