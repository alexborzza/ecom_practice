import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";

const API_URL = "http://localhost:8000/product.php";

function ProductDetail() {
  const { id } = useParams();
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
          </div>
        )}
      </main>  
    </>
  );
}

export default ProductDetail;
