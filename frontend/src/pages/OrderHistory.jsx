import { useEffect, useState } from "react";
import Header from "../components/Header";

// Adjust this to match where your PHP backend is served from
const API_URL = "http://localhost:8000/orders/history.php";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to load order history");
        }
        setOrders(json.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />

      <main className="order-history">
        <h2>Order History</h2>

        {loading && <p>Loading orders...</p>}

        {error && <p className="checkout-error">Error: {error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="cart-empty">You haven't placed any orders yet.</p>
        )}

        {!loading &&
          !error &&
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="order-card-id">Order #{order.id}</p>
                  <p className="order-card-date">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="order-card-status">{order.status}</span>
              </div>

              <div className="order-shipping">
                <p>
                  Name: <strong>{order.customer_name}</strong>
                </p>
                <p>Address: {order.customer_address}</p>
                <p>Phone No: {order.customer_phone}</p>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="checkout-summary-item"
                  >
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="checkout-summary-image"
                    />
                    <span className="checkout-summary-name">
                      {item.product_name} x{item.quantity}
                    </span>
                    <span className="checkout-summary-price">
                      {(item.price * item.quantity).toFixed(2)} lei
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-card-total">
                <strong>Total: {order.total.toFixed(2)} lei</strong>
              </div>
            </div>
          ))}
      </main>
    </>
  );
}

export default OrderHistory;
