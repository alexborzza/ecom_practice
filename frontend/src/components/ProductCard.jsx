import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ id, name, price, image_url, description, stock }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const goToDetail = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id, name, price, image_url, stock });
  };

  return (
    <div className="product-card" onClick={goToDetail}>
      <img src={image_url} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">{price} lei</p>
      <button
        className="product-button"
        onClick={handleAddToCart}
        disabled={stock <= 0}
      >
        {stock <= 0 ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}

export default ProductCard;
