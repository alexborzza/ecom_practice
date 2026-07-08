import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-link">
        <h1>Shop</h1>
      </Link>
    </header>
  );
}

export default Header;
