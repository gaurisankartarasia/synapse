
// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import type { Product } from "@/types/store/types";

// // Internal type with relevance score for sorting
// interface ProductWithRelevance extends Product {
//   id: string;
//   relevanceScore: number;
// }

// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get("q")?.trim() ?? "";
//     const lowerCaseQuery = query.toLowerCase();
    
//     // Pagination parameters
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "12", 10);
//     const offset = (page - 1) * limit;
    
//     // Category filter (optional)
//     const category = searchParams.get("category") || null;
    
//     // Sort parameter (optional)
//     const sortBy = searchParams.get("sortBy") || "relevance"; // Default sort is by relevance
    
//     if (query.length < 2) {
//         return NextResponse.json({ 
//             products: [], 
//             total: 0, 
//             page, 
//             limit, 
//             totalPages: 0 
//         }, { status: 200 });
//     }
    
//     try {
//         let productsQuery = db.collection('products')
//             .where('isActive', '==', true);
        
//         // Apply category filter if provided
//         if (category) {
//             productsQuery = productsQuery.where('category', '==', category);
//         }
        
//         // We need to run different queries based on search approach
//         const queryPromises = [];
        
//         // --- Query 1: Name Prefix Search ---
//         const nameEndQuery = query + '\uf8ff';
//         const nameQuery = productsQuery
//             .where('name', '>=', query)
//             .where('name', '<=', nameEndQuery)
//             .get();
//         queryPromises.push(nameQuery);
        
//         // --- Query 2: Keyword Search ---
//         const keywordQuery = productsQuery
//             .where('searchKeywords', 'array-contains', lowerCaseQuery)
//             .get();
//         queryPromises.push(keywordQuery);
        
//         // Execute all queries concurrently
//         const [nameSnapshot, keywordSnapshot] = await Promise.all(queryPromises);
        
//         // Merge results and remove duplicates
//         const productsMap = new Map<string, ProductWithRelevance>();
        
//         // Process name prefix results
//         nameSnapshot.docs.forEach(doc => {
//             const data = doc.data() as Product;
//             // Boost exact name match relevance (higher priority)
//             const relevanceScore = data.name.toLowerCase() === lowerCaseQuery ? 100 : 50;
            
//             productsMap.set(doc.id, {
//                 ...data,
//                 id: doc.id,
//                 relevanceScore
//             });
//         });
        
//         // Process keyword results
//         keywordSnapshot.docs.forEach(doc => {
//             const data = doc.data() as Product;
//             // If already in map, boost relevance score by adding keyword match points
//             if (productsMap.has(doc.id)) {
//                 const existingProduct = productsMap.get(doc.id)!;
//                 existingProduct.relevanceScore += 30;
//             } else {
//                 // Add with base keyword match relevance
//                 productsMap.set(doc.id, {
//                     ...data,
//                     id: doc.id,
//                     relevanceScore: 30
//                 });
//             }
//         });
        
//         // Convert map to array
//         let results = Array.from(productsMap.values());
        
//         // Sort results based on the sortBy parameter
//         switch (sortBy) {
//             case "price_asc":
//                 results.sort((a, b) => (a.price || 0) - (b.price || 0));
//                 break;
//             case "price_desc":
//                 results.sort((a, b) => (b.price || 0) - (a.price || 0));
//                 break;
//             case "name_asc":
//                 results.sort((a, b) => a.name.localeCompare(b.name));
//                 break;
//             case "name_desc":
//                 results.sort((a, b) => b.name.localeCompare(a.name));
//                 break;
//             case "newest":
//                 results.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
//                 break;
//             default:
//                 // Default: sort by relevance (descending)
//                 results.sort((a, b) => b.relevanceScore - a.relevanceScore);
//                 break;
//         }
        
//         // Calculate total and pagination
//         const total = results.length;
//         const totalPages = Math.ceil(total / limit);
        
//         // Apply pagination
//         const paginatedResults = results.slice(offset, offset + limit);
        
//         // Remove internal relevance score before sending response
//         const sanitizedResults = paginatedResults.map(({ relevanceScore, ...rest }) => rest);
        
//         return NextResponse.json({
//             products: sanitizedResults,
//             total,
//             page,
//             limit,
//             totalPages
//         }, { status: 200 });
        
//     } catch (error: any) {
//         console.error("Error fetching search results:", error);
        
//         if (error.code === 'failed-precondition' && error.message.includes('index')) {
//             console.warn("Firestore index required for search results. Check Firestore console.");
//             return NextResponse.json({ 
//                 error: "Database configuration needed (index).", 
//                 products: [] 
//             }, { status: 500 });
//         }
        
//         return NextResponse.json({ 
//             error: `Server error: ${error.message || 'Failed to fetch search results'}`,
//             products: []
//         }, { status: 500 });
//     }
// }


import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import type { Product } from "@/types/store/types";
import type { CustomJWTPayload } from "@/types/auth";

// Internal type with relevance score for sorting
interface ProductWithRelevance extends Product {
  id: string;
  relevanceScore: number;
  isWishlisted?: boolean;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const lowerCaseQuery = query.toLowerCase();
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const offset = (page - 1) * limit;
    
    // Category filter (optional)
    const category = searchParams.get("category") || null;
    
    // Sort parameter (optional)
    const sortBy = searchParams.get("sortBy") || "relevance"; // Default sort is by relevance
    
    // Get user ID for wishlist check
    let uid: string | null = null;
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (token) {
            const decoded = await verifyJWT(token) as CustomJWTPayload;
            uid = decoded?.uid || null;
        }
    } catch (error) {
        console.error("Auth token verification error:", error);
        // Continue without user authentication - search will work but without wishlist data
    }
    
    if (query.length < 2) {
        return NextResponse.json({ 
            products: [], 
            total: 0, 
            page, 
            limit, 
            totalPages: 0 
        }, { status: 200 });
    }
    
    try {
        let productsQuery = db.collection('products')
            .where('isActive', '==', true);
        
        // Apply category filter if provided
        if (category) {
            productsQuery = productsQuery.where('category', '==', category);
        }
        
        // We need to run different queries based on search approach
        const queryPromises = [];
        
        // --- Query 1: Name Prefix Search ---
        const nameEndQuery = query + '\uf8ff';
        const nameQuery = productsQuery
            .where('name', '>=', query)
            .where('name', '<=', nameEndQuery)
            .get();
        queryPromises.push(nameQuery);
        
        // --- Query 2: Keyword Search ---
        const keywordQuery = productsQuery
            .where('searchKeywords', 'array-contains', lowerCaseQuery)
            .get();
        queryPromises.push(keywordQuery);
        
        // Execute all queries concurrently
        const [nameSnapshot, keywordSnapshot] = await Promise.all(queryPromises);
        
        // Merge results and remove duplicates
        const productsMap = new Map<string, ProductWithRelevance>();
        
        // Process name prefix results
        nameSnapshot.docs.forEach(doc => {
            const data = doc.data() as Product;
            // Boost exact name match relevance (higher priority)
            const relevanceScore = data.name.toLowerCase() === lowerCaseQuery ? 100 : 50;
            
            productsMap.set(doc.id, {
                ...data,
                id: doc.id,
                relevanceScore
            });
        });
        
        // Process keyword results
        keywordSnapshot.docs.forEach(doc => {
            const data = doc.data() as Product;
            // If already in map, boost relevance score by adding keyword match points
            if (productsMap.has(doc.id)) {
                const existingProduct = productsMap.get(doc.id)!;
                existingProduct.relevanceScore += 30;
            } else {
                // Add with base keyword match relevance
                productsMap.set(doc.id, {
                    ...data,
                    id: doc.id,
                    relevanceScore: 30
                });
            }
        });
        
        // Convert map to array
        let results = Array.from(productsMap.values());
        
        // Fetch wishlist data if user is authenticated
        if (uid) {
            // Get all wishlist items for the user
            const wishlistSnapshot = await db.collection(`users/${uid}/storeWishlist`).get();
            
            // Create a Set of wishlisted product IDs for faster lookup
            const wishlistedProductIds = new Set(
                wishlistSnapshot.docs.map(doc => doc.data().productId || doc.id)
            );
            
            // Add wishlist information to each product
            results = results.map(product => ({
                ...product,
                isWishlisted: wishlistedProductIds.has(product.id)
            }));
        } else {
            // If user is not authenticated, mark all products as not wishlisted
            results = results.map(product => ({
                ...product,
                isWishlisted: false
            }));
        }
        
        // Sort results based on the sortBy parameter
        switch (sortBy) {
            case "price_asc":
                results.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "price_desc":
                results.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "name_asc":
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name_desc":
                results.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "newest":
                results.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
                break;
            default:
                // Default: sort by relevance (descending)
                results.sort((a, b) => b.relevanceScore - a.relevanceScore);
                break;
        }
        
        // Calculate total and pagination
        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        
        // Apply pagination
        const paginatedResults = results.slice(offset, offset + limit);
        
        // Remove internal relevance score before sending response (but keep isWishlisted)
        const sanitizedResults = paginatedResults.map(({ relevanceScore, ...rest }) => rest);
        
        return NextResponse.json({
            products: sanitizedResults,
            total,
            page,
            limit,
            totalPages
        }, { status: 200 });
        
    } catch (error: any) {
        console.error("Error fetching search results:", error);
        
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
            console.warn("Firestore index required for search results. Check Firestore console.");
            return NextResponse.json({ 
                error: "Database configuration needed (index).", 
                products: [] 
            }, { status: 500 });
        }
        
        return NextResponse.json({ 
            error: `Server error: ${error.message || 'Failed to fetch search results'}`,
            products: []
        }, { status: 500 });
    }
}