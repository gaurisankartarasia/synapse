"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border-b">
            <div>
              <h2 className="text-lg">{item.name}</h2>
              <p>₹{item.price} × {item.quantity}</p>
            </div>
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))
      )}
      {cart.length > 0 && (
        <button
          onClick={() => router.push("/store/checkout")}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
}
