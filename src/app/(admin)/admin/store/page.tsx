"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseClient";  
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null, 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProduct((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("/admin/store/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data.imageUrl; // Return uploaded image URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.image) {
      setMessage("Please select an image.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const imageUrl = await uploadImage(product.image);

      const newProduct = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        imageUrl,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), newProduct);

      setMessage("✅ Product added successfully!");
      setProduct({ name: "", description: "", price: "", image: null });
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ Failed to add product. Try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}



