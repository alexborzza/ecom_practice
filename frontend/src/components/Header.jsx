import { Link } from "react-router-dom";
import CartBadge from "./CartBadge";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <Link to="/" className="header-link">
        <h1>Shop</h1>
      </Link>

      <div className="header-right">
        {user ? (
          <div className="auth-status">
            {user.role === "admin" && (
              <Link to="/admin" className="admin-link">
                Admin
              </Link>
            )}
            <Link to="/orders" className="admin-link">
              Order History
            </Link>
            <span>Hi, {user.name}</span>
            <button className="auth-logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}

        <span className="header-divider"></span>
        <CartBadge />
      </div>
    </header>
  );
}

export default Header;
