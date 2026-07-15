import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

// Adjust this to match where your PHP backend is served from
const API_URL = "http://localhost:8000/products/products.php";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to load products");
        }
        setProducts(json.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />

      <main className="product-list">
        {loading && <p>Loading products...</p>}

        {error && <p>Error: {error}</p>}

        {!loading &&
          !error &&
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={Number(product.price)}
              image_url={product.image_url}
              description={product.description}
              stock={Number(product.stock)}
            />
          ))}
      </main>
    </>
  );
}

export default ProductList;
