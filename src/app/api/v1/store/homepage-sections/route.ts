// src/app/api/homepage-sections/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import type { Product, Category } from '@/types/store/types'; // Use your defined types

// Define which category sections to feature on the homepage
// Replace with your actual category IDs and desired titles
const FEATURED_CATEGORY_SECTIONS = [
    { id: 'electronics_id', title: 'Best of Electronics', limit: 6 }, // Replace 'electronics_id'
    { id: 'fashion_id', title: 'Top Fashion Picks', limit: 6 },     // Replace 'fashion_id'
    { id: 'home_id', title: 'Home Essentials', limit: 6 }         // Replace 'home_id'
    // Add more sections as needed
];

// Helper function to fetch products for a specific category
async function getProductsForCategory(categoryId: string, limitCount: number): Promise<Product[]> {
    const productsQuery = db.collection('products')
        .where('allCategoryIds', 'array-contains', categoryId)
        // .where('isActive', '==', true) // Optional: Only show active products
        .orderBy('createdAt', 'desc') // Or order by popularity, sales, etc.
        .limit(limitCount);

    const snapshot = await productsQuery.get();
    const products: Product[] = [];
    snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() } as Product);
    });
    return products;
}

// Helper function to fetch top-level categories
async function getTopLevelCategories(): Promise<Category[]> {
     const categoriesQuery = db.collection('categories')
        .where('parentCategoryId', '==', null) // Filter for top-level
        .orderBy('name', 'asc'); // Or order by a custom 'displayOrder' field

    const snapshot = await categoriesQuery.get();
    const categories: Category[] = [];
    snapshot.forEach(doc => {
        // Only include fields needed by the client (name, id, iconUrl/iconName)
        const data = doc.data();
        categories.push({
             id: doc.id,
             name: data.name,
             iconUrl: data.iconUrl || null, // Include icon if available
             // Ensure other large fields aren't sent unnecessarily
            } as Category); // Adjust type casting as needed
    });
    return categories;
}


export async function GET() {
    // Using Promise.all to fetch everything concurrently on the server
    try {
        const [
            topLevelCategories, // Fetch categories for the nav bar
            ...featuredProductResults // Fetch products for all featured sections
        ] = await Promise.all([
            getTopLevelCategories(),
            ...FEATURED_CATEGORY_SECTIONS.map(section =>
                getProductsForCategory(section.id, section.limit)
            )
        ]);

        // Structure the featured sections data
        const featuredSections = FEATURED_CATEGORY_SECTIONS.map((section, index) => ({
            title: section.title,
            categoryId: section.id,
            products: featuredProductResults[index] || [], // Match results by index
        }));

        // Combine all data into a single response object
        const homepageData = {
            topLevelCategories,
            featuredSections,
        };

        return NextResponse.json(homepageData);

    } catch (error: any) {
        console.error("Error fetching homepage data:", error);
        return NextResponse.json(
            { error: `Failed to fetch homepage data: ${error.message}` },
            { status: 500 }
        );
    }
}

// Add revalidation if using App Router caching (optional)
// export const revalidate = 3600; // Revalidate data every hour