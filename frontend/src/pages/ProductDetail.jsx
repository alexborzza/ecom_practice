import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

// Adjust this to match where your PHP backend is served from
const API_URL = "http://localhost:8000/products/product.php";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_URL}?id=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to load product");
        }
        setProduct(json.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
    });
  };

  return (
    <>
      <Header/>

      <main className="product-detail">
        <Link to="/" className="back-link">
          &larr; Back
        </Link>

        {loading && <p>Loading product...</p>}

        {error && <p>Error: {error}</p>}

        {!loading && !error && product && (
          <div className="product-detail-card">
            <img
              src={product.image_url}
              alt={product.name}
              className="product-detail-image"
            />
            <h2 className="product-detail-name">{product.name}</h2>
            <p className="product-detail-description">
              {product.description}
            </p>
            <p className="product-detail-price">{product.price} lei</p>
            <p
              className={`product-detail-stock${
                product.stock > 0 ? "" : " out-of-stock"
              }`}
            >
              {product.stock > 0
                ? `In stock: ${product.stock}`
                : "Out of stock"}
            </p>
            <button
              className="product-button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to cart
            </button>
          </div>
        )}
      </main>  
    </>
  );
}

export default ProductDetail;
