function ProductCard({ name, price, image_url, description }) {
  return (
    <div className="product-card">
      <img src={image_url} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">{price} lei</p>
      <button className="product-button">Add to cart</button>
    </div>
  );
}

export default ProductCard;