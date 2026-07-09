import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartView() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  return (
    <div className="cart-view">
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <img
            src={item.image_url}
            alt={item.name}
            className="cart-item-image"
          />

          <div className="cart-item-info">
            <p className="cart-item-name">{item.name}</p>
            <p className="cart-item-subtotal">
              {(item.price * item.quantity).toFixed(2)} lei
            </p>
          </div>

          <div className="cart-item-controls-row">
            <p className="cart-item-price">{item.price} lei each</p>

            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <strong>Total: {totalPrice.toFixed(2)} lei</strong>
      </div>

      <button
        className="product-button cart-checkout-button"
        onClick={() => navigate("/checkout")}
      >
        Checkout
      </button>
    </div>
  );
}

export default CartView;
