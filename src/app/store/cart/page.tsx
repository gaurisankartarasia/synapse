// "use client";

// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { removeFromCart } from "@/redux/features/cartSlice";
// import { useRouter } from "next/navigation";

// export default function CartPage() {
//   const cart = useSelector((state: RootState) => state.cart.items);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         cart.map((item) => (
//           <div key={item.id} className="flex justify-between items-center p-4 border-b">
//             <div>
//               <h2 className="text-lg">{item.name}</h2>
//               <p>₹{item.price} × {item.quantity}</p>
//             </div>
//             <button
//               onClick={() => dispatch(removeFromCart(item.id))}
//               className="bg-red-500 text-white px-3 py-1 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))
//       )}
//       {cart.length > 0 && (
//         <button
//           onClick={() => router.push("/store/checkout")}
//           className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Proceed to Checkout
//         </button>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container, Box, Button, Card } from "@mui/material";

interface CartItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  } | null;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/v1/store/cart");
        const data = await res.json();

        if (res.ok) {
          setCartItems(data.items);
        } else {
          console.error("Failed to load cart:", data.error);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch("/api/v1/store/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const result = await res.json();
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      } else {
        console.error("Remove failed:", result.error);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (loading) {
    return <p className="p-6">Loading cart...</p>;
  }

  return (
    <Container maxWidth="xl" >
      <h1 className="text-lg font-bold mb-4">Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <Card
            key={item.productId}
            className="flex gap-3 justify-evenly items-center p-4 m-2 border-b"
          >
           {item.product?.imageUrl ? (
              <Image src={item.product.imageUrl} width={100} height={100} alt={item.product.name} />
            ) : (
              <Box width={100} height={100} sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Image
              </Box>
            )}
            <div>
              <h2 className="text-lg">{item.product?.name ?? "Product unavailable"}</h2>
              {item.product && (
                <p>₹{item.product.price} × {item.quantity}</p>
              )}
            </div>
            <Button
              onClick={() => handleRemove(item.productId)}
            >
              Remove
            </Button>
          </Card>
        ))
      )}

      {cartItems.length > 0 && (
        <Button
        variant="contained"
          onClick={() => router.push("/store/checkout")}
        >
          Place Order
        </Button>
      )}
    </Container>
  );
}
