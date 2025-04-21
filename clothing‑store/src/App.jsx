// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";

import { useCart }        from "./components/CartContext.jsx";
import RequireAuth         from "./components/RequireAuth.jsx";
import Filters             from "./components/Filters.jsx";
import ProductList         from "./components/ProductList.jsx";
import CartDrawer          from "./components/CartDrawer.jsx";
import SearchBar           from "./components/SearchBar.jsx";
import CheckoutPage        from "./components/CheckoutPage.jsx";

import {
  Authenticator,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const API_BASE = "https://ht6v4zlpkd.execute-api.us-east-1.amazonaws.com/prod";

export default function App() {
  const [products, setProducts] = useState([]);
  const [filters,  setFilters]  = useState({
    gender: "",
    category: "",
    range: [0, 100],
  });
  const [search,   setSearch]   = useState("");
  const [openCart, setOpenCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const { add } = useCart();
  const { authStatus, signOut } = useAuthenticator((ctx) => [
    ctx.authStatus,
  ]);
  const navigate = useNavigate();

  // Fetch products once
  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((r) => r.json())
      .then((items) => {
        const prods = items.map((p) => {
          const id       = p.id?.S ?? p.id;
          const name     = p.name?.S ?? p.name;
          const price    = p.price?.N ? parseFloat(p.price.N) : Number(p.price);
          const category = p.category?.S ?? p.category;
          const gender   = p.gender?.S ?? p.gender;
          const imageUrl = p.image?.S ?? p.image;
          return { id, name, price, category, gender, imageUrl };
        });
        setProducts(prods);
        if (prods.length) {
          const ps = prods.map((x) => x.price);
          setFilters((f) => ({
            ...f,
            range: [Math.min(...ps), Math.max(...ps)],
          }));
        }
      })
      .catch(console.error);
  }, []);

  function handleAdd(product) {
    if (authStatus !== "authenticated") {
      setShowAuth(true);
      return;
    }
    add(product);
  }

  return (
    <>
      {/* Inline Auth UI */}
      {showAuth && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowAuth(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Authenticator
              hideSignUp={false}
              onStateChange={(nextState) => {
                if (nextState === "signedIn") {
                  setShowAuth(false);
                }
              }}
            />
          </div>
        </div>
      )}

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />

      <header className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-30">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-pink-600">clothy.</span>
        </Link>
        <div className="flex items-center space-x-4">
          {authStatus === "authenticated" ? (
            <button
              onClick={signOut}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Sign In
            </button>
          )}
          <button onClick={() => setOpenCart(true)}>
            <ShoppingCart size={28} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="grid lg:grid-cols-[250px_1fr] gap-6">
                <Filters
                  min={filters.range[0]}
                  max={filters.range[1]}
                  filters={filters}
                  setFilters={setFilters}
                />
                <div className="space-y-6">
                  <SearchBar value={search} onChange={setSearch} />
                  <ProductList
                    products={products}
                    filters={filters}
                    search={search}
                    onAdd={handleAdd}
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
    </>
  );
}