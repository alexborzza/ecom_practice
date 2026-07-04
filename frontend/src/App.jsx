import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header/>

      <main className="product-list">

        <ProductCard
          name="Mouse Gaming"
          price={299.99}
          image_url="https://placehold.co/200x150"
          description="Ergonomie superioara"
        />

        <ProductCard
          name="Tastatura Gaming"
          price={599.99}
          image_url="https://placehold.co/200x150"
          description="Hall Effect Switch"
        />

        <ProductCard
          name="Sapca Valve"
          price={180.0}
          image_url="https://placehold.co/200x150"
          description="Sapca cu Logo Valve"
        />

      </main>
    </div>
  );
}

export default App;