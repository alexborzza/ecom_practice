import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";

// Adjust this to match where your PHP backend is served from
const API_URL = "http://localhost:8000/orders/order.php";

function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: "",
    customer_address: "",
    customer_phone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    fetch(API_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to place order");
        }
        setConfirmation(json);
        clearCart();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (confirmation) {
    return (
      <>
        <Header />
        <main className="checkout">
          <div className="checkout-confirmation">
            <h2>Order placed successfully!</h2>
            <p>Order #{confirmation.order_id}</p>
            <p>Total: {confirmation.total.toFixed(2)} lei</p>
            <button className="product-button" onClick={() => navigate("/")}>
              Back to shop
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="checkout">
        <h2>Checkout</h2>

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="checkout-summary">
              {items.map((item) => (
                <div key={item.id} className="checkout-summary-item">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="checkout-summary-image"
                  />
                  <span className="checkout-summary-name">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="checkout-summary-price">
                    {(item.price * item.quantity).toFixed(2)} lei
                  </span>
                </div>
              ))}
              <div className="checkout-summary-total">
                <strong>Total: {totalPrice.toFixed(2)} lei</strong>
              </div>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label className="checkout-label">
                Name
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="checkout-label">
                Address
                <input
                  type="text"
                  name="customer_address"
                  value={form.customer_address}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="checkout-label">
                Phone
                <input
                  type="tel"
                  name="customer_phone"
                  value={form.customer_phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="checkout-label">
                Payment method
                <p className="checkout-payment-method">Cash upon shipping</p>
              </div>

              {error && <p className="checkout-error">{error}</p>}

              <button
                type="submit"
                className="product-button"
                disabled={submitting}
              >
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}

export default Checkout;
