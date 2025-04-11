// src/components/CategoryNavBar.tsx
import type { Category } from '@/types/store/types';
import Image from 'next/image';
// Example using a placeholder icon if none provided
const PLACEHOLDER_ICON = 'https://via.placeholder.com/50x50?text=CAT';

export function CategoryNavBar({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <div className="bg-white shadow-md mb-4">
      <nav className="container mx-auto px-4 py-2">
        <ul className="flex justify-between items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((category) => (
            <li key={category.id} className="text-center px-3 py-1 flex-shrink-0">
              <a href={`/category/${category.id}`} className="inline-block hover:text-blue-600"> {/* Link to category page */}
                {/* <Image
                  src={category.iconUrl || PLACEHOLDER_ICON}
                  alt={category.name}
                  width={50}
                  height={50}
                  className="mx-auto mb-1 object-contain"
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER_ICON)}
                /> */}
                <span className="text-xs font-medium text-gray-800 group-hover:text-blue-600">
                  {category.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}