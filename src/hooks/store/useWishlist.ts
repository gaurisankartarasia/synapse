// //src/hooks/store/useWishlist.ts
// import { Product } from "@/types/store/types";

// export async function handleAddToWishlist(product: Product) {

//     const res = await fetch("/api/v1/store/products/wishlist", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ productId: product.id }),
//     });
  
//     const data = await res.json();
//     if (!res.ok) {
//       console.error("Failed to add to wishlist:", data.error);
//     } else {
//       console.log("Success:", data.message);
//     }
//   }
  
// src/hooks/store/useWishlist.ts
import { Product } from "@/types/store/types";

export async function handleAddToWishlist(product: Product) {
  const res = await fetch("/api/v1/store/products/wishlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: product.id }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to add to wishlist");
  }
  return data; // Return response data (e.g., { message: "Added to wishlist" })
}