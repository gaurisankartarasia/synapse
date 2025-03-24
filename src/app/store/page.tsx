"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/v1/store/products");
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    
      {products.map((product) => (
        <div
          key={product.id}
          className="border p-4 rounded-lg cursor-pointer hover:shadow-lg"
          onClick={() => router.push(`/store/products/${product.id}`)}
        >
          <Image src={product.imageUrl} width={80} height={80} alt={product.name} className=" object-cover rounded" />
          <h2 className="text-lg font-bold mt-2">{product.name}</h2>
          <p className="text-gray-500">${product.price}</p>
        </div>
      ))}
    </div>
  );
}
