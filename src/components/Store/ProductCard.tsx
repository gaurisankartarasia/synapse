// src/components/ProductCard.tsx
import type { Product } from '@/types/store/types';
import Image from 'next/image'; // Use Next.js Image for optimization

// Placeholder image URL
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative border border-gray-200 rounded-md overflow-hidden bg-white p-2 text-center shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
       <a href={`/product/${product.id}`} className="block aspect-square overflow-hidden mb-2"> {/* Link to product page */}
         <Image
            src={product.imageUrl || PLACEHOLDER_IMAGE}
            alt={product.name}
            width={200} // Provide appropriate dimensions
            height={200}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
         />
      </a>
      <div className="mt-auto"> {/* Pushes content below to the bottom */}
        <h3 className="text-sm font-medium text-gray-800 truncate mb-1">
            <a href={`/product/${product.id}`}>{product.name}</a>
        </h3>
        {/* You might show 'From $X' or a specific deal price */}
        <p className="text-sm font-semibold text-green-700">
            From ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}