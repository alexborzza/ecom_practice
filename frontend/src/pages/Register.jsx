import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form.name, form.email, form.password);
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
        <h2>Create account</h2>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="checkout-label">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

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
              minLength={6}
              required
            />
          </label>

          {error && <p className="checkout-error">{error}</p>}

          <button
            type="submit"
            className="product-button"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </main>
    </>
  );
}

export default Register;
