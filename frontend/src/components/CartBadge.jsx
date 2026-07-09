import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartView from "./CartView";

function CartBadge() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="cart-dropdown-container">
      <div
        className="cart-badge-wrapper"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="cart-icon">Cart</span>
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </div>

      {isOpen && (
        <div className="cart-dropdown">
          <CartView />
        </div>
      )}
    </div>
  );
}

export default CartBadge;
