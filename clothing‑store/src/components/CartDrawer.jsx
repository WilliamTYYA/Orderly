// src/components/CartDrawer.jsx
import React from "react";
import { useCart } from "./CartContext";    // ← make sure this path matches your file
import { X } from "lucide-react";

export default function CartDrawer({ open, onClose }) {
  const { items, remove, total } = useCart();   // now defined!

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-10rem)]">
        {items.length === 0 && <p>Your cart is empty.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.qty} × ${item.price.toFixed(2)}
              </p>
            </div>
            <button onClick={() => remove(item.id)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <p className="font-semibold">Total: ${total.toFixed(2)}</p>
        <a
          href="/checkout"
          className="bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-800"
        >
          Checkout
        </a>
      </div>
    </div>
  );
}