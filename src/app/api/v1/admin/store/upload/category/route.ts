// src/app/api/admin/store/categories/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import type { Category } from "@/types/store/types"; // Import shared type

interface CategoryPayload {
    name: string;
    description?: string;
    parentCategoryId: string | null;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as CategoryPayload;

    if (!payload.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    let parentCategoryData: Category | null = null;
    let calculatedAncestorIds: string[] = [];

    // If a parent is specified, fetch it to get its ancestorIds
    if (payload.parentCategoryId) {
      const parentDocRef = db.collection('categories').doc(payload.parentCategoryId);
      const parentDocSnap = await parentDocRef.get();

      if (!parentDocSnap.exists) {
        return NextResponse.json({ error: `Parent category with ID ${payload.parentCategoryId} not found` }, { status: 404 });
      }
      parentCategoryData = { id: parentDocSnap.id, ...parentDocSnap.data() } as Category;
      // New ancestors are parent's ancestors + parent's ID
      calculatedAncestorIds = [...(parentCategoryData.ancestorIds || []), parentDocSnap.id];
    }

    // Prepare the document data for the new category
    const newCategoryData = {
      name: payload.name,
      description: payload.description || "",
      parentCategoryId: payload.parentCategoryId, // null or the selected ID
      ancestorIds: calculatedAncestorIds,        // empty array or calculated array
      // productCount: 0, // Initialize if using denormalized count
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Add the document
    const docRef = await db.collection("categories").add(newCategoryData);

    console.log("Category added with ID:", docRef.id);
    return NextResponse.json({ success: true, categoryId: docRef.id }, { status: 201 });

  } catch (error: any) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: `Server error: ${error.message || 'Failed to add category'}` }, { status: 500 });
  }
}