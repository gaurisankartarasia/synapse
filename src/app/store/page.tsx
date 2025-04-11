// src/app/page.tsx (Or your desired homepage route)
"use client";

import { useState, useEffect } from 'react';
import { CategoryNavBar } from '@/components/Store/CategoryNavBar';
import { ProductSection } from '@/components/Store/ProductSection';
import type { Category, Product } from '@/types/store/types';

interface HomePageData {
    topLevelCategories: Category[];
    featuredSections: Array<{
        title: string;
        categoryId: string;
        products: Product[];
    }>;
}

export default function HomePage() {
    const [homepageData, setHomepageData] = useState<HomePageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch data from our API endpoint
                const response = await fetch('/api/v1/store/homepage-sections');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `API Error: ${response.statusText}`);
                }
                const data: HomePageData = await response.json();
                setHomepageData(data);
            } catch (err: any) {
                console.error("Failed to fetch homepage data:", err);
                setError(err.message || "Could not load homepage data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Fetch data once on component mount

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Store...</p></div>; // Add a spinner here
    }

    if (error) {
        return <div className="text-center text-red-600 p-10">Error: {error}</div>;
    }

    if (!homepageData) {
        return <div className="text-center text-gray-500 p-10">Could not load store data.</div>;
    }

    return (
        <main className="bg-gray-100 min-h-screen">
            {/* Render Category Navigation Bar */}
            <CategoryNavBar categories={homepageData.topLevelCategories} />

            <div className="container mx-auto p-4">
                {/* Optional: Promotional Banner Section could go here */}
                {/* <div className="bg-blue-500 text-white p-10 rounded-lg mb-6 text-center">
                    Promotional Banner Here!
                </div> */}

                {/* Render Product Sections */}
                {homepageData.featuredSections.map((section) => (
                    <ProductSection
                        key={section.categoryId} // Use categoryId or title as key
                        title={section.title}
                        products={section.products}
                        categoryId={section.categoryId}
                    />
                ))}
            </div>
        </main>
    );
}