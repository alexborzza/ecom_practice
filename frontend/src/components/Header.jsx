import { Link } from "react-router-dom";
import CartBadge from "./CartBadge";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-link">
        <h1>Shop</h1>
      </Link>
      <CartBadge />
    </header>
  );
}

export default Header;
