import { Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
