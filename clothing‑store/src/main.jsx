// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Amplify
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";
Amplify.configure(awsExports);

// Amplify UI & Authenticator context
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// Router & Cart
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./components/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </Authenticator.Provider>
  </React.StrictMode>
);