// "use client";

// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrl: string;
//   category: string;
// }

// interface SearchResults {
//   products: Product[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get('q') || '';
//   const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<string>('relevance');
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       if (!query || query.length < 2) {
//         setSearchResults(null);
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(
//           `/api/v1/store/search?q=${encodeURIComponent(query)}&page=${currentPage}&sortBy=${sortBy}`
//         );

//         if (!response.ok) {
//           throw new Error('Failed to fetch search results');
//         }

//         const data = await response.json();
//         setSearchResults(data);
//       } catch (err: any) {
//         console.error('Error fetching search results:', err);
//         setError(err.message || 'Failed to load search results');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSearchResults();
//   }, [query, currentPage, sortBy]);

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortBy(e.target.value);
//     setCurrentPage(1); // Reset to first page when sorting changes
//   };

//   const handlePageChange = (page: number) => {
//     if (page < 1 || page > (searchResults?.totalPages || 1)) return;
//     setCurrentPage(page);
//     // Scroll to top when changing pages
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Generate pagination items
//   const renderPagination = () => {
//     if (!searchResults || searchResults.totalPages <= 1) return null;

//     const pages = [];
//     const totalPages = searchResults.totalPages;
//     const currentPageNum = searchResults.page;

//     // Always show first page
//     pages.push(
//       <button
//         key="first"
//         onClick={() => handlePageChange(1)}
//         className={`px-3 py-1 rounded ${
//           currentPageNum === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
//         }`}
//       >
//         1
//       </button>
//     );

//     // Calculate range of pages to show
//     let startPage = Math.max(2, currentPageNum - 1);
//     let endPage = Math.min(totalPages - 1, currentPageNum + 1);

//     // Show ellipsis after first page if needed
//     if (startPage > 2) {
//       pages.push(
//         <span key="ellipsis1" className="px-2">
//           ...
//         </span>
//       );
//     }

//     // Show middle pages
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           className={`px-3 py-1 rounded ${
//             currentPageNum === i ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }

//     // Show ellipsis before last page if needed
//     if (endPage < totalPages - 1) {
//       pages.push(
//         <span key="ellipsis2" className="px-2">
//           ...
//         </span>
//       );
//     }

//     // Always show last page if there's more than one page
//     if (totalPages > 1) {
//       pages.push(
//         <button
//           key="last"
//           onClick={() => handlePageChange(totalPages)}
//           className={`px-3 py-1 rounded ${
//             currentPageNum === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200'
//           }`}
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return (
//       <div className="flex justify-center gap-2 mt-8">
//         <button
//           onClick={() => handlePageChange(currentPageNum - 1)}
//           disabled={currentPageNum === 1}
//           className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         {pages}
//         <button
//           onClick={() => handlePageChange(currentPageNum + 1)}
//           disabled={currentPageNum === totalPages}
//           className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
   

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
//         {searchResults && (
//           <p className="text-gray-600">
//             {searchResults.total} {searchResults.total === 1 ? 'result' : 'results'} found
//           </p>
//         )}
//       </div>

//       {/* Search Controls */}
//       {searchResults && searchResults.total > 0 && (
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center">
//             <label htmlFor="sort-by" className="mr-2 ">
//               Sort by:
//             </label>
//             <select
//               id="sort-by"
//               value={sortBy}
//               onChange={handleSortChange}
//               className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="relevance">Relevance</option>
//               <option value="price_asc">Price: Low to High</option>
//               <option value="price_desc">Price: High to Low</option>
//               <option value="name_asc">Name: A to Z</option>
//               <option value="name_desc">Name: Z to A</option>
//               <option value="newest">Newest First</option>
//             </select>
//           </div>
//         </div>
//       )}

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex justify-center items-center py-20">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Error State */}
//       {error && !isLoading && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* No Results */}
//       {!isLoading && !error && searchResults?.products.length === 0 && (
//         <div className="py-10 text-center">
//           <p className="text-xl text-gray-600">No products found for "{query}"</p>
//           <p className="mt-2 text-gray-500">Try using different keywords or browse our categories</p>
//         </div>
//       )}

//       {/* Results Grid */}
//       {!isLoading && !error && searchResults?.products.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {searchResults?.products.map((product) => (
//             <Link 
//               href={`/store/products/${product.id}`} 
//               key={product.id} 
//               className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               <div className="relative w-full h-48 bg-gray-200">
//                 {product.imageUrl ? (
//                   <Image
//                     src={product.imageUrl}
//                     alt={product.name}
//                     fill
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-gray-400">
//                     No image
//                   </div>
//                 )}
//               </div>
//               <div className="p-4">
//                 <h3 className="font-medium text-lg text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
//                 <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
//                 <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {searchResults && searchResults.totalPages > 1 && renderPagination()}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/store/types';
import ProductCard from '@/components/Store/catalog/ProductCard';

interface SearchResults {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query || query.length < 2) {
        setSearchResults(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/v1/store/search?q=${encodeURIComponent(query)}&page=${currentPage}&sortBy=${sortBy}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err: any) {
        console.error('Error fetching search results:', err);
        setError(err.message || 'Failed to load search results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage, sortBy]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (searchResults?.totalPages || 1)) return;
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination items
  const renderPagination = () => {
    if (!searchResults || searchResults.totalPages <= 1) return null;

    const pages = [];
    const totalPages = searchResults.totalPages;
    const currentPageNum = searchResults.page;

    // Always show first page
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded ${
          currentPageNum === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        1
      </button>
    );

    // Calculate range of pages to show
    const startPage = Math.max(2, currentPageNum - 1);
    const endPage = Math.min(totalPages - 1, currentPageNum + 1);

    // Show ellipsis after first page if needed
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPageNum === i ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    // Show ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${
            currentPageNum === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPageNum - 1)}
          disabled={currentPageNum === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPageNum + 1)}
          disabled={currentPageNum === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
   

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
        {searchResults && (
          <p className="text-gray-600">
            {searchResults.total} {searchResults.total === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {/* Search Controls */}
      {searchResults && searchResults.total > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <label htmlFor="sort-by" className="mr-2 ">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

     {/* No Results */}
{!isLoading && !error && searchResults && searchResults.products.length === 0 && (
  <div className="py-10 text-center">
    <p className="text-xl text-gray-600">No products found for "{query}"</p>
    <p className="mt-2 text-gray-500">Try using different keywords or browse our categories</p>
  </div>
)}

{/* Results Grid */}
{!isLoading && !error && searchResults && searchResults.products.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-6">
    {searchResults.products.map((product) => (
 
       <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

      

      {/* Pagination */}
      {searchResults && searchResults.totalPages > 1 && renderPagination()}
    </div>
  );
}




