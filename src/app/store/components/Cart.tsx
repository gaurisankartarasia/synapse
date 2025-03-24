"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Cart() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between p-2 border-b">
              <span>{item.name} (x{item.quantity})</span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
