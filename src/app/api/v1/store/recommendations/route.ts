// src/app/api/store/recommendations/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import type { Product } from "@/types/store/types"; // Adjust path if necessary

export async function GET(req: Request) {
    try {
        // Fetch products that are active AND marked as recommended
        const recommendationsSnapshot = await db.collection('products')
            .where('isActive', '==', true)
            .where('isRecommended', '==', true) // Key: Filter by our new flag
            .orderBy('createdAt', 'desc')       // Optional: Order recommended items (e.g., newest first)
            .limit(10)                          // Limit the number of recommendations shown
            .get();

        const recommendedProducts: Product[] = recommendationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Product)); // Cast to Product

        return NextResponse.json({ products: recommendedProducts }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching recommendations:", error);
        // Check for specific Firestore errors if needed
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
             console.warn("Firestore index required for recommendations query. Check Firestore console.");
             // Return an empty array or specific error for missing index
             return NextResponse.json({ error: "Database configuration needed (index).", products: [] }, { status: 500 });
        }
        return NextResponse.json({ error: `Server error: ${error.message || 'Failed to fetch recommendations'}` }, { status: 500 });
    }
}

// Ensure your Product type includes isRecommended (optional boolean)
// src/types/store/types.ts
/*
export interface Product {
  // ... other fields
  isActive: boolean;
  isRecommended?: boolean; // Add this field (optional)
  // ... other fields
}
*/