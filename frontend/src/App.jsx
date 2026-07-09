import { Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import "./App.css";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
