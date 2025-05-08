// src/app/api/admin/store/products/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // Use Admin SDK Firestore instance
import { FieldValue } from "firebase-admin/firestore"; // Use Admin SDK FieldValue
import type { ProductPayload, Category } from "@/types/store/types"; // Import shared types



// Helper to generate keywords
function generateKeywords(name: string, description?: string, tags?: string[]): string[] {
  const nameWords = name.toLowerCase().split(/\s+/); // Split name by space
  const descWords = description ? description.toLowerCase().split(/\s+/).slice(0, 15) : []; // Limit description words
  const tagWords = tags ? tags.map(tag => tag.toLowerCase()) : [];

  // Combine, remove duplicates, filter out very short words (optional) and punctuation
  const combined = [...nameWords, ...descWords, ...tagWords];
  const uniqueKeywords = [...new Set(combined)]
                         .map(word => word.replace(/[.,!?;:]/g, '')) // Remove basic punctuation
                         .filter(word => word.length > 1); // Filter out single letters/empty strings

  return uniqueKeywords;
}


// Helper function to get all ancestor IDs for selected categories
async function getAllCategoryIds(directCategoryIds: string[]): Promise<string[]> {
  if (!directCategoryIds || directCategoryIds.length === 0) {
    return [];
  }

  const allIds = new Set<string>(directCategoryIds); // Use Set for uniqueness

  const categoryPromises = directCategoryIds.map(id =>
    db.collection('categories').doc(id).get()
  );

  const categorySnapshots = await Promise.all(categoryPromises);

  for (const docSnap of categorySnapshots) {
    if (docSnap.exists) {
      const categoryData = docSnap.data() as Category; // Cast to Category type
      if (categoryData.ancestorIds && Array.isArray(categoryData.ancestorIds)) {
        categoryData.ancestorIds.forEach(ancestorId => allIds.add(ancestorId));
      }
      // If you also need the parentId itself in allCategoryIds (and it's not in ancestorIds)
      // if (categoryData.parentCategoryId) {
      //   allIds.add(categoryData.parentCategoryId);
      // }
    } else {
      console.warn(`Category with ID ${docSnap.id} not found while calculating allCategoryIds.`);
      // Decide if you want to throw an error or just ignore missing categories
    }
  }

  return Array.from(allIds);
}


export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as ProductPayload;

    // Basic Server-Side Validation
    if (!payload.name || !payload.price || !payload.imageUrl || !payload.categoryIds || payload.categoryIds.length === 0) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }
    if (isNaN(payload.price) || payload.price < 0) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // Calculate allCategoryIds based on the direct categoryIds provided
    const calculatedAllCategoryIds = await getAllCategoryIds(payload.categoryIds);
    const keywords = generateKeywords(payload.name, payload.description, payload.tags);

    // Prepare the document data for Firestore
    const newProductData = {
      name: payload.name,
      description: payload.description || "", // Provide default if optional
      price: payload.price,
      sku: payload.sku || null, // Handle optional fields
      imageUrl: payload.imageUrl,
      stockQuantity: payload.stockQuantity !== undefined ? payload.stockQuantity : 0, // Default stock
      isActive: payload.isActive !== undefined ? payload.isActive : true, // Default active state
      categoryIds: payload.categoryIds, // Direct IDs from client
      allCategoryIds: calculatedAllCategoryIds, // Calculated ancestor + direct IDs
      tags: payload.tags || [], 
      searchKeywords: keywords, 
      // Optional: Fetch category names here if you want to denormalize them
      // categoryNames: await getCategoryNames(payload.categoryIds),
      createdAt: FieldValue.serverTimestamp(), // Use Admin SDK server timestamp
      updatedAt: FieldValue.serverTimestamp(), // Use Admin SDK server timestamp
    };

    // Add the document to the 'products' collection
    const docRef = await db.collection("products").add(newProductData);

    console.log("Product added with ID:", docRef.id);
    // Return the ID of the newly created product
    return NextResponse.json({ success: true, productId: docRef.id }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding product:", error);
    // Log more specific error details if possible
    const errorMessage = error.message || "Failed to add product.";
    // Avoid exposing sensitive error details to the client in production
    return NextResponse.json({ error: `Server error: ${errorMessage}` }, { status: 500 });
  }
}

