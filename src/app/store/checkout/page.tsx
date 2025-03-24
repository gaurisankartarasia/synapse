"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";


export default function CheckoutPage() {
    const {user} = useAuth()
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    try {

      if (!user) {
        return alert("Please log in to place an order.");
      }

      const res = await fetch("/api/v1/store/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({ items: cart }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      dispatch(clearCart());
      alert("Order placed successfully!");
      router.push("/store/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg">{item.name}</h2>
                <p>${item.price} × {item.quantity}</p>
              </div>
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
