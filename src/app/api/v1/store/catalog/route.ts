
//src/app/api/v1/store/catalog/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import type { Category, Product } from "@/types/store/types";


 interface TopLevelCatalogCategory extends Category {
    products: Product[]; // products belonging to this category or its descendants
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let uid: string | null = null;

    if (token) {
      try {
        const decoded = await verifyJWT(token);
        uid = decoded?.uid || null;
      } catch {
        uid = null;
      }
    }

    const topLevelCategoriesSnapshot = await db.collection("categories")
      .where("parentCategoryId", "==", null)
      .orderBy("name")
      .get();

    const topLevelCategories: Category[] = topLevelCategoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Category));

    const userWishlistDocIds = uid
      ? (await db.collection(`users/${uid}/storeWishlist`).get()).docs.map(doc => doc.id)
      : [];

    const categoryProductPromises = topLevelCategories.map(async (category) => {
      const productsSnapshot = await db.collection("products")
        .where("isActive", "==", true)
        .where("allCategoryIds", "array-contains", category.id)
        .orderBy("createdAt", "desc")
        .limit(8)
        .get();

      const products: Product[] = productsSnapshot.docs.map(doc => {
        const product = {
          id: doc.id,
          ...doc.data(),
        } as Product;

        return {
          ...product,
          isWishlisted: userWishlistDocIds.includes(product.id),
        };
      });

      return {
        ...category,
        products,
      } as TopLevelCatalogCategory;
    });

    const categoriesWithProducts: TopLevelCatalogCategory[] = await Promise.all(categoryProductPromises);
    const categoriesWithProductsFiltered = categoriesWithProducts.filter(cat => cat.products.length > 0);

    return NextResponse.json({ categoriesWithProducts: categoriesWithProductsFiltered }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: `Server error: ${error.message || 'Failed to fetch catalog data'}` }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import type { Category, Product } from "@/types/store/types";

// interface TopLevelCatalogCategory extends Category {
//   products: Product[]; // Products belonging to this category or its descendants
// }

// // Helper to fetch all descendant category IDs for a given category
// async function getDescendantCategoryIds(categoryId: string): Promise<string[]> {
//   const descendantIds: string[] = [];
//   const queue: string[] = [categoryId];

//   while (queue.length > 0) {
//     const currentId = queue.shift()!;
//     const subCategoriesSnapshot = await db
//       .collection("categories")
//       .where("parentCategoryId", "==", currentId)
//       .get();

//     const subCategoryIds = subCategoriesSnapshot.docs.map(doc => {
//       descendantIds.push(doc.id);
//       return doc.id;
//     });

//     queue.push(...subCategoryIds);
//   }

//   return descendantIds;
// }

// export async function GET(req: Request) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     let uid: string | null = null;

//     if (token) {
//       try {
//         const decoded = await verifyJWT(token);
//         uid = decoded?.uid || null;
//       } catch {
//         uid = null;
//       }
//     }

//     // Fetch top-level categories
//     const topLevelCategoriesSnapshot = await db
//       .collection("categories")
//       .where("parentCategoryId", "==", null)
//       .orderBy("name")
//       .get();

//     const topLevelCategories: Category[] = topLevelCategoriesSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     } as Category));

//     // Fetch user wishlist if authenticated
//     const userWishlistDocIds = uid
//       ? (await db.collection(`users/${uid}/storeWishlist`).get()).docs.map(doc => doc.id)
//       : [];

//     // Track processed product IDs to prevent duplication
//     const processedProductIds = new Set<string>();

//     const categoryProductPromises = topLevelCategories.map(async (category) => {
//       // Get all descendant category IDs (including the category itself)
//       const descendantCategoryIds = [category.id, ...(await getDescendantCategoryIds(category.id))];

//       // Fetch products that belong directly to any of these categories
//       const productsSnapshot = await db
//         .collection("products")
//         .where("isActive", "==", true)
//         .where("categoryIds", "array-contains-any", descendantCategoryIds)
//         .orderBy("createdAt", "desc")
//         .limit(8)
//         .get();

//       const products: Product[] = productsSnapshot.docs
//         .map(doc => {
//           const product = {
//             id: doc.id,
//             ...doc.data(),
//           } as Product;

//           // Skip if product was already processed
//           if (processedProductIds.has(product.id)) {
//             return null;
//           }

//           // Mark product as processed
//           processedProductIds.add(product.id);

//           return {
//             ...product,
//             isWishlisted: userWishlistDocIds.includes(product.id),
//           };
//         })
//         .filter((product): product is Product => product !== null);

//       return {
//         ...category,
//         products,
//       } as TopLevelCatalogCategory;
//     });

//     const categoriesWithProducts: TopLevelCatalogCategory[] = await Promise.all(categoryProductPromises);
//     const categoriesWithProductsFiltered = categoriesWithProducts.filter(cat => cat.products.length > 0);

//     return NextResponse.json({ categoriesWithProducts: categoriesWithProductsFiltered }, { status: 200 });
//   } catch (error: any) {
//     console.error("Error fetching catalog:", error);
//     return NextResponse.json(
//       { error: `Server error: ${error.message || "Failed to fetch catalog data"}` },
//       { status: 500 }
//     );
//   }
// }