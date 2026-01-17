//

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await fetch(
      `http://localhost:5000/api/orders/${user.id}`
    );
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <p>Loading orders...</p>;

  if (orders.length === 0) {
    return <p>No orders placed yet</p>;
  }

  return (
    <div className="orders">
      <h3>Your Orders</h3>

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p><b>{order.symbol}</b></p>
          <p>Qty: {order.qty}</p>
          <p>Price: ₹{order.price}</p>
          <p>Type: {order.type}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
