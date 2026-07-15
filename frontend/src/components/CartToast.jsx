import { useCart } from "../context/CartContext";

function CartToast() {
  const { message, clearMessage } = useCart();

  if (!message) {
    return null;
  }

  return (
    <div className="cart-toast">
      <span>{message}</span>
      <button className="cart-toast-dismiss" onClick={clearMessage}>
        &times;
      </button>
    </div>
  );
}

export default CartToast;
