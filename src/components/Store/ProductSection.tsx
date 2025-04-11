// src/components/ProductSection.tsx
import type { Product } from '@/types/store/types';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  categoryId?: string; // Optional link to view all in category
}

export function ProductSection({ title, products, categoryId }: ProductSectionProps) {
  if (!products || products.length === 0) {
    // Optionally render nothing or a message if a section has no products
     // return <div className="my-4"><p>No items currently featured in {title}.</p></div>;
     return null;
  }

  return (
    <section className="bg-white shadow rounded-md mb-6 p-4">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {categoryId && (
          <a
            href={`/category/${categoryId}`} // Link to view all products in this category
            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-100 px-3 py-1 rounded"
          >
            View All
          </a>
        )}
      </div>
      {/* Use a grid, adjust columns as needed */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}