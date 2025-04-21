import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { useCart } from "./components/CartContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Filters from "./components/Filters.jsx";
import ProductList from "./components/ProductList.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CheckoutPage from "./components/CheckoutPage.jsx";

// import sampleProducts from "./sampleData.js";

export default function App() {

  const [sampleProducts, setSampleProducts] = useState([]);

  useEffect(() => {
    fetch('https://ht6v4zlpkd.execute-api.us-east-1.amazonaws.com/prod/products')
      .then((res) => res.json())
      .then((data) => setSampleProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  // 1) derive the min/max price from your data
  const prices = sampleProducts.map((p) => Number(p.price));
  const absoluteMin = prices.length ? Math.min(...prices) : 0;
  const absoluteMax = prices.length ? Math.max(...prices) : 100;

  // 2) initialize filters state using those values
  const [filters, setFilters] = useState({
    gender: "",
    category: "",
    range: [absoluteMin, absoluteMax],
  });
  const [search, setSearch] = useState("");
  const [openCart, setOpenCart] = useState(false);

  // 3) useCart() now works because CartProvider wraps App in main.jsx
  const { add } = useCart();

  return (
    <BrowserRouter>
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />

      <header className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-30">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-pink-600">clothy.</span>
        </Link>
        <button onClick={() => setOpenCart(true)}>
          <ShoppingCart size={28} />
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grid lg:grid-cols-[250px_1fr] gap-6">
                {/* pass min/max into Filters */}
                <Filters
                  min={absoluteMin}
                  max={absoluteMax}
                  filters={filters}
                  setFilters={setFilters}
                />
                <div className="space-y-6">
                  <SearchBar value={search} onChange={setSearch} />
                  <ProductList
                    products={sampleProducts}
                    filters={filters}
                    search={search}
                    onAdd={add}
                  />
                </div>
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}