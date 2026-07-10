import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

// Adjust this to match where your PHP backend is served from
const PRODUCTS_URL = "http://localhost:8000/products/products.php";
const PRODUCT_URL = "http://localhost:8000/products/product.php";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    fetch(PRODUCTS_URL)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to load products");
        }
        setProducts(json.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }

    fetch(`${PRODUCT_URL}?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to delete product");
        }
        loadProducts();
      })
      .catch((err) => setError(err.message));
  };

  return (
    <>
      <Header />
      <main className="admin">
        <div className="admin-header-row">
          <h2>Manage products</h2>
          <Link to="/admin/products/new" className="product-button admin-add-button">
            Add product
          </Link>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="checkout-error">{error}</p>}

        {!loading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="admin-thumb"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{Number(product.price).toFixed(2)} lei</td>
                  <td>{product.stock}</td>
                  <td className="admin-actions">
                    <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
                    <button
                      className="admin-delete-button"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export default AdminProducts;
