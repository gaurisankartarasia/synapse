// src/app/(admin)/admin/store/add-category/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient"; // Client SDK for reading categories
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { Category } from "@/types/store/types"; // Import shared type

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null); // Store parent ID

  const [categories, setCategories] = useState<Category[]>([]); // To populate parent dropdown
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing categories to populate the parent selector
  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCategories(true);
      setError("");
      try {
        const q = query(collection(db, "categories"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const fetchedCategories: Category[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load existing categories.");
      } finally {
        setIsFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: categoryName,
        description: description,
        // Send null if "None" is selected, otherwise the category ID
        parentCategoryId: parentCategoryId === "NONE" ? null : parentCategoryId,
      };

      // Call the Server-Side API to Add Category
      const res = await fetch("/api/v1/admin/store/upload/category", { // NEW API ROUTE
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add category via API.");
      }

      setMessage(`✅ Category added successfully! ID: ${data.categoryId}`);
      // Reset form
      setCategoryName("");
      setDescription("");
      setParentCategoryId(null);
      // Optionally refetch categories to update dropdown, or manage state
    } catch (error: any) {
      console.error("Error submitting category:", error);
      setError(`❌ Failed to add category: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
        />

        <div>
          <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            id="parentCategory"
            value={parentCategoryId ?? "NONE"} // Use "NONE" for the null/no parent option
            onChange={(e) => setParentCategoryId(e.target.value === "NONE" ? null : e.target.value)}
            className="w-full border p-2 rounded bg-white"
            disabled={isFetchingCategories}
          >
            <option value="NONE">{isFetchingCategories ? "Loading..." : "-- None (Top Level) --"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={isLoading || isFetchingCategories}
        >
          {isLoading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}