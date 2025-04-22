// src/components/CheckoutPage.jsx
import React from "react";
import { useCart } from "./CartContext.jsx";
import { useAuthenticator } from "@aws-amplify/ui-react";
// import { Auth } from "@aws-amplify/auth"

export default function CheckoutPage() {
  const { items, clear } = useCart();
  // const { user } = useAuthenticator((ctx) => [ctx.user]);
  const { authStatus }   = useAuthenticator((ctx) => [ctx.authStatus]);
  const [email, setEmail] = React.useState("");

  // When we become signed in, grab the user’s email
  // React.useEffect(() => {
  //   if (authStatus === "authenticated") {
  //     Auth.currentAuthenticatedUser()
  //       .then((u) => {
  //         // u.attributes.email is guaranteed once signed in
  //         setEmail(u.attributes.email);
  //       })
  //       .catch(console.error);
  //   }
  // }, [authStatus]);

  const placeOrder = () => {
    // const product_ids = items.map((item) => item.id);
    fetch("https://ht6v4zlpkd.execute-api.us-east-1.amazonaws.com/prod/checkout", {
      method: "POST",
      mode: "cors",   // optional; this is the default for cross‑origin
      headers: {
        "Content-Type": "application/json",
        // if you need auth:
        // "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        items, 
        user_email: "william170111@gmail.com" // or pull dynamically later
      }),
    })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(() => {
      clear();
      alert("Order placed! 🎉");
    })
    .catch((err) => {
      console.error("Order failed:", err);
      alert("Sorry, something went wrong.");
    });
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const src = item.imageUrl || item.image || "";
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-3">
                    {src ? (
                      <img
                        src={src}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                    <span>
                      {item.qty} × {item.name}
                    </span>
                  </div>
                  <span className="font-medium">
                    ${(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <hr />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>
              $
              {items
                .reduce((sum, p) => sum + p.price * p.qty, 0)
                .toFixed(2)}
            </span>
          </div>

          <button
            onClick={placeOrder}
            className="w-full bg-pink-600 text-white rounded-xl py-3 hover:bg-pink-700"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}