// src/app/(admin)/admin/store/add-product/page.tsx (or similar path)
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient"; // Still need client SDK for reading categories
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { Category } from "@/types/store/types"; // Import shared type

export default function AddProductPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      setError("");
      try {
        // Example: Fetch categories ordered by name
        const q = query(collection(db, "categories"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const fetchedCategories: Category[] = [];
        querySnapshot.forEach((doc) => {
          // Important: Include the document ID
          fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please refresh.");
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
        setImage(null);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryId = e.target.value;
    setSelectedCategoryIds((prev) =>
      e.target.checked
        ? [...prev, categoryId] // Add ID if checked
        : prev.filter((id) => id !== categoryId) // Remove ID if unchecked
    );
  };

  // Function to upload image (Calls the existing server route)
  const uploadImage = async (imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", imageFile);

    // Use the correct path for your upload API route
    const res = await fetch("/api/v1/admin/store/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Image upload failed");
    }
    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!image) {
      setError("Please select an image.");
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError("Please select at least one category.");
      return;
    }
     const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        setError("Please enter a valid positive price.");
        return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Image
      const imageUrl = await uploadImage(image);

      // 2. Prepare Payload for Product API
      const productPayload = {
        name: productName,
        description: description,
        price: parsedPrice,
        imageUrl,
        categoryIds: selectedCategoryIds,
        // You could add optional fields here if needed e.g.
        // sku: "SOME-SKU",
        // stockQuantity: 10,
        // isActive: true,
      };

      // 3. Call the Server-Side API to Add Product
      const res = await fetch("/api/v1/admin/store/upload/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add product via API.");
      }

      setMessage(`✅ Product added successfully! ID: ${data.productId}`);
      // Reset form
      setProductName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setSelectedCategoryIds([]);
      // Clear file input visually (might need useRef)
       const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

    } catch (error: any) {
      console.error("Error submitting product:", error);
      setError(`❌ Failed to add product: ${error.message}. Check console for details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

      {message && <p className="mb-4 text-center text-green-600 bg-green-100 p-2 rounded">{message}</p>}
      {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-2 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="e.g., SuperFast Laptop Pro"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
           <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            id="price"
            type="number"
            name="price"
            placeholder="e.g., 1299.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            step="0.01" // Allows cents
            min="0"
          />
        </div>

        <div>
           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Detailed product description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
           <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
           {image && <p className="text-xs text-gray-500 mt-1">Selected: {image.name}</p>}
        </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
           {isFetchingCategories ? (
                <p className="text-gray-500">Loading categories...</p>
            ) : categories.length === 0 ? (
                <p className="text-red-500">No categories found. Please add categories first.</p>
            ) : (
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2 space-y-1">
                    {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                        <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={selectedCategoryIds.includes(category.id)}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor={`category-${category.id}`} className="text-sm text-gray-700">{category.name}</label>
                    </div>
                    ))}
                </div>
            )}
         </div>


        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2.5 px-4 rounded shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={isLoading || isFetchingCategories || categories.length === 0}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}