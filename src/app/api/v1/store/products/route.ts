// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";

// export async function GET() {
//   try {
//     const productsRef = db.collection("products");
//     const snapshot = await productsRef.get();

//     const products = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return NextResponse.json({ products });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
//   }
// }



// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { Query } from 'firebase-admin/firestore'; // Import Query type for type safety

export async function GET(req: Request) {
    // Extract search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category'); // Get 'category' query param (e.g., ?category=Electronics)
    // You can add more filters similarly:
    // const subcategory = searchParams.get('subcategory');
    // const type = searchParams.get('type');
    // const sortBy = searchParams.get('sortBy') || 'createdAt'; // Default sort
    // const sortDirection = searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc'; // Default direction
    // const limit = parseInt(searchParams.get('limit') || '10', 10); // For pagination

    try {
        // Start with the base query selecting the 'products' collection
        let productsQuery: Query = db.collection('products');

        // ** Apply category filter if provided **
        if (category && typeof category === 'string') {
            // Use .where() to filter documents where the 'category' field matches the query parameter
            productsQuery = productsQuery.where('category', '==', category);
            // ** Firestore Index Note: **
            // If you frequently filter by category AND sort by another field (like price or createdAt),
            // you will likely need to create a composite index in your Firebase console.
            // Firestore usually provides a link in the error message if an index is needed.
        }

        // Add other filters (example for subcategory)
        // if (subcategory && typeof subcategory === 'string') {
        //     productsQuery = productsQuery.where('subcategory', '==', subcategory);
        // }

        // Add sorting (example: sort by creation date, newest first)
        // Ensure the field exists and you have an index if combining with filters
        productsQuery = productsQuery.orderBy('createdAt', 'desc');

        // Add limit for pagination (example)
        // productsQuery = productsQuery.limit(limit);

        // Execute the query
        const snapshot = await productsQuery.get();

        // Check if any documents were found
        if (snapshot.empty) {
            return NextResponse.json({ products: [] }, { status: 200 }); // Return empty array if no match
        }

        // Map the documents to an array of product data
        const products = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id, // Include the document ID
                ...data,
                // **Important**: Convert Firestore Timestamps to a client-friendly format (ISO string or milliseconds)
                // Browsers cannot serialize Firestore Timestamps directly.
                createdAt: data.createdAt?.toDate().toISOString() || null,
                updatedAt: data.updatedAt?.toDate().toISOString() || null,
            };
        });

        // Return the array of products
        return NextResponse.json({ products }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching products:", error);
        // Return a generic error message or more specific details if safe
        return NextResponse.json({ error: `Failed to fetch products: ${error.message || 'Unknown server error'}` }, { status: 500 });
    }
}