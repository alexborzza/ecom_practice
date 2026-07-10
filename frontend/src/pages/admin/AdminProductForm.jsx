import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";

// Adjust these to match where your PHP backend is served from
const PRODUCTS_URL = "http://localhost:8000/products/products.php";
const PRODUCT_URL = "http://localhost:8000/products/product.php";
const CATEGORIES_URL = "http://localhost:8000/products/categories.php";

function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(CATEGORIES_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCategories(json.data);
        }
      })
      .catch(() => {
        // Category list is a nice-to-have; don't block the form if it fails
      });
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    fetch(`${PRODUCT_URL}?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to load product");
        }
        const p = json.data;
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          image_url: p.image_url || "",
          stock: p.stock ?? "",
          category_id: p.category_id ?? "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      image_url: form.image_url,
      stock: parseInt(form.stock, 10) || 0,
      category_id: form.category_id ? parseInt(form.category_id, 10) : null,
    };

    const url = isEditing ? `${PRODUCT_URL}?id=${id}` : PRODUCTS_URL;
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.error || "Failed to save product");
        }
        navigate("/admin");
      })
      .catch((err) => setError(err.message))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="admin">
          <p>Loading product...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="admin">
        <h2>{isEditing ? "Edit product" : "Add product"}</h2>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="checkout-label">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="checkout-label">
            Description
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label className="checkout-label">
            Price (lei)
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label className="checkout-label">
            Image URL
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
            />
          </label>

          <label className="checkout-label">
            Stock
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </label>

          <label className="checkout-label">
            Category
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="checkout-error">{error}</p>}

          <button
            type="submit"
            className="product-button"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEditing
              ? "Save changes"
              : "Create product"}
          </button>
        </form>
      </main>
    </>
  );
}

export default AdminProductForm;
