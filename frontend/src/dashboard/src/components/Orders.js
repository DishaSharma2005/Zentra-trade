import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/orders/${user.id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      // Sort by created_at descending (most recent first)
      const sortedData = data.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedData);
      setError(null);
    } catch (err) {
      console.error("Order fetch error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancelling(orderId);
        const res = await fetch(
          `http://localhost:5000/api/orders/${orderId}`,
          { method: "DELETE" }
        );

        if (!res.ok) {
          throw new Error("Failed to cancel order");
        }

        setOrders(orders.filter(o => o.id !== orderId));
        toast.success("Order cancelled successfully");
      } catch (err) {
        console.error("Cancel order error:", err.message);
        toast.error("Failed to cancel order: " + err.message);
      } finally {
        setCancelling(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="orders">
        <h3 className="title">Orders</h3>
        <p className="loading-text">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <h3 className="title">Orders</h3>
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <h3 className="title">Orders</h3>
        <div className="no-orders">
          <p className="no-orders-icon">📋</p>
          <p>No orders placed yet</p>
          <p className="no-orders-subtext">Start trading to see your orders here</p>
          <button onClick={fetchOrders} className="btn btn-blue">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="orders-header">
        <h3 className="title">Orders ({orders.length})</h3>
        <button onClick={fetchOrders} className="btn btn-blue" title="Refresh orders">
          🔄 Refresh
        </button>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Type</th>
              <th>Status</th>
              <th>Total Value</th>
              <th>Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="align-left">
                  <strong>{order.symbol}</strong>
                </td>
                <td>{order.qty}</td>
                <td>₹{Number(order.price).toFixed(2)}</td>
                <td
                  className={
                    order.type === "BUY" ? "order-buy" : "order-sell"
                  }
                >
                  {order.type === "BUY" ? "🟢 BUY" : "🔴 SELL"}
                </td>
                <td>
                  <span
                    className={
                      order.status === "PENDING"
                        ? "order-pending"
                        : order.status === "COMPLETED"
                        ? "order-completed"
                        : "order-cancelled"
                    }
                  >
                    {order.status === "PENDING" && "⏳ " }
                    {order.status === "COMPLETED" && "✓ " }
                    {order.status === "CANCELLED" && "✗ " }
                    {order.status}
                  </span>
                </td>
                <td>₹{(order.qty * order.price).toFixed(2)}</td>
                <td className="order-timestamp">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "N/A"}
                </td>
                <td className="order-action">
                  {order.status === "PENDING" ? (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="btn-cancel"
                      title="Cancel this order"
                    >
                      {cancelling === order.id ? "⏳..." : "✗ Cancel"}
                    </button>
                  ) : (
                    <span className="action-disabled">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
