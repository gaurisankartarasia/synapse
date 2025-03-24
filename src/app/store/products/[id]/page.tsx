
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { addToCart } from "@/redux/features/cartSlice";
// import { AppDispatch } from "@/redux/store";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// export default function ProductPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch for TypeScript support

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`/api/v1/store/products/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch product");
//         const data = await res.json();
//         setProduct(data);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded" />
//       <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
//       <p className="text-gray-500 mt-2">${product.price}</p>
//       <p className="mt-4">{product.description}</p>
//       <button
//         onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
//         className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Check if the product is already in the cart
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isInCart = cartItems.some((item) => item.id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/v1/store/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Image src={product.imageUrl} fill alt={product.name} className=" object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-500 mt-2">${product.price}</p>
      <p className="mt-4">{product.description}</p>
      <button
        onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
        disabled={isInCart}
        className={`mt-6 px-4 py-2 rounded ${
          isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
        }`}
      >
        {isInCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
