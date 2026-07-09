import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="checkout">
        <h2>Log in</h2>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="checkout-label">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="checkout-label">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="checkout-error">{error}</p>}

          <button
            type="submit"
            className="product-button"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </main>
    </>
  );
}

export default Login;
