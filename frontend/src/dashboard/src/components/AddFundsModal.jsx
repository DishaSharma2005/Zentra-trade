import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const AddFundsModal = ({ onClose }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            userId: user.id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("No checkout URL received");
      }

      // redirect to stripe
      window.location.href = data.url;
    } catch (err) {
      console.error("Add money error:", err.message);
      setError(err.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-money-container">
      <div className="add-money-modal">
        <h3 className="add-money-title">Add Money to Your Account</h3>

        <form onSubmit={handleAddMoney}>
          <div className="form-group">
            <label htmlFor="amount">Enter Amount (₹)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              placeholder="Enter amount in ₹"
              min="100"
              step="1"
              required
              disabled={loading}
              className="amount-input"
            />
            <p className="amount-info">Minimum: ₹100</p>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>

          <p className="payment-info">
            💳 You will be redirected to Stripe for secure payment
          </p>
        </form>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddFundsModal;
