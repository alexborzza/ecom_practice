import { useNavigate } from "react-router-dom";

function ProductCard({ id, name, price, image_url, description }) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card" onClick={goToDetail}>
      <img src={image_url} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">{price} lei</p>
      <button
        className="product-button"
        onClick={(e) => {
          e.stopPropagation();
          // Add to cart logic goes here
        }}
      >
        Add to cart
      </button>
    </div>
  );
}

export default ProductCard;
