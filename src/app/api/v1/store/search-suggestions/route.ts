// src/app/api/store/search-suggestions/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import type { Product, Suggestion } from "@/types/store/types";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const lowerCaseQuery = query.toLowerCase(); // Use lowercase for keyword search

    if (query.length < 2) { // Keep minimum length
        return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    // Firestore "starts with" simulation for 'name' field
    const nameEndQuery = query + '\uf8ff';
    // Limit for each query type
    const suggestionLimit = 5;

    try {
        // --- Query 1: Name Prefix Search ---
        // Case-sensitive match using range query
        const nameQuery = db.collection('products')
            .where('isActive', '==', true)
            .where('name', '>=', query) // Use original case for name prefix
            .where('name', '<=', nameEndQuery)
            .orderBy('name')
            .limit(suggestionLimit)
            .get();

        // --- Query 2: Keyword Search (using lowercase) ---
        const keywordQuery = db.collection('products')
            .where('isActive', '==', true)
            .where('searchKeywords', 'array-contains', lowerCaseQuery) // Exact match on lowercase keyword
            .limit(suggestionLimit)
            .get(); // Note: Cannot orderBy 'name' here easily after array-contains

        // --- Execute Queries Concurrently ---
        const [nameSnapshot, keywordSnapshot] = await Promise.all([nameQuery, keywordQuery]);

        // --- Merge Results & Remove Duplicates ---
        const suggestionsMap = new Map<string, Suggestion>();

        // Process name prefix results
        nameSnapshot.docs.forEach(doc => {
            const data = doc.data() as Product;
            if (!suggestionsMap.has(doc.id)) { // Avoid duplicates if already found by keyword
                 suggestionsMap.set(doc.id, {
                    id: doc.id,
                    name: data.name,
                    type: 'product',
                    imageUrl: data.imageUrl,
                });
            }
        });

        // Process keyword results (add only if not already present from name search)
        keywordSnapshot.docs.forEach(doc => {
            if (!suggestionsMap.has(doc.id)) {
                const data = doc.data() as Product;
                 suggestionsMap.set(doc.id, {
                    id: doc.id,
                    name: data.name,
                    type: 'product',
                    imageUrl: data.imageUrl,
                });
            }
        });

        // Convert map values to array and potentially limit total results
        const combinedSuggestions = Array.from(suggestionsMap.values());
        const finalSuggestions = combinedSuggestions.slice(0, 7); // Apply overall limit if desired

        return NextResponse.json({ suggestions: finalSuggestions }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching search suggestions:", error);
        // Check for potential index errors for *both* query types
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
             console.warn("Firestore index required for search suggestions. Check Firestore console. Likely needs indexes for (isActive, name) AND (isActive, searchKeywords).");
             return NextResponse.json({ error: "Database configuration needed (index).", suggestions: [] }, { status: 500 });
        }
        return NextResponse.json({ error: `Server error: ${error.message || 'Failed to fetch suggestions'}` }, { status: 500 });
    }
}