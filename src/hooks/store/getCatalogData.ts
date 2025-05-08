// src/lib/store/getCatalogData.ts
import type { Category, Product } from "@/types/store/types";


 interface TopLevelCatalogCategory extends Category {
    products: Product[]; // products belonging to this category or its descendants
}

export async function getCatalogData(): Promise<{
  categoriesWithProducts: TopLevelCatalogCategory[];
} | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/v1/store/catalog`, {
      method: "GET",
      cache: "default",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error("Failed to fetch catalog data:", res.status, res.statusText);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getCatalogData fetch:", error);
    return null;
  }
}
