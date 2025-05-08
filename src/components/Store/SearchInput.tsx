// src/components/store/SearchInput.tsx (create this file)

"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Use App Router's router
import Image from 'next/image';
import Link from 'next/link';
import useDebounce from '@/hooks/useDebounce'; 
import { Box } from '@mui/material'; 

// Define the structure for suggestions matching the API response
interface Suggestion {
    id: string;
    name: string;
    type: 'product';
    imageUrl?: string;
}

// Simple Icon components (replace with your preferred icon library like lucide-react)
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const LoadingSpinner = () => ( // Simple spinner
    <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
);


export default function SearchInput() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for click outside

    // Debounce the search term (e.g., wait 300ms after user stops typing)
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // --- Fetch Suggestions ---
    const fetchSuggestions = useCallback(async (query: string) => {
        if (query.length < 2) { // Minimum query length
            setSuggestions([]);
            setShowSuggestions(false);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setShowSuggestions(true); // Show dropdown while loading/fetching

        try {
            const response = await fetch(`/api/v1/store/search-suggestions?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.error) {
                 throw new Error(data.error);
            }
            setSuggestions(data.suggestions || []);

        } catch (err: any) {
            console.error("Failed to fetch suggestions:", err);
            setError('Could not load suggestions.');
            setSuggestions([]); // Clear suggestions on error
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback wraps the function

    // --- Effect to fetch when debounced term changes ---
    useEffect(() => {
        fetchSuggestions(debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchSuggestions]); // Depend on debounced term and the fetch function

    // --- Handle Input Change ---
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // --- Handle Form Submission (Enter Key) ---
    const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault(); // Prevent default form submission if used within a form
        if (searchTerm.trim()) {
            router.push(`/store/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false); // Hide suggestions on submit
            setSearchTerm(''); // Optional: clear search term after submit
        }
    };

    // --- Handle Suggestion Click ---
    const handleSuggestionClick = (suggestion: Suggestion) => {
        // Option 1: Go directly to product page (if applicable)
        if (suggestion.type === 'product') {
            router.push(`/store/product/${suggestion.id}`);
        } else {
             // Go to search results page for other types or as fallback
            router.push(`/store/search?q=${encodeURIComponent(suggestion.name)}`);
        }

        // Option 2: Always go to search results page, pre-filled
        router.push(`/store/search?q=${encodeURIComponent(suggestion.name)}`);

        setSearchTerm(''); // Clear input
        setShowSuggestions(false);
    };


     useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainerRef]); 

    return (
        <div ref={searchContainerRef} className="relative w-full max-w-md mx-auto"> {/* Container with Ref */}
            <form onSubmit={handleSearchSubmit} role="search" className="relative">
                 <input
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)} 
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search products"
                />
                 <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-blue-600"
                    aria-label="Submit search"
                 >
                    <SearchIcon />
                 </button>
            </form>

            {showSuggestions && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {isLoading && (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                            <LoadingSpinner />
                            <span className="ml-2">Loading...</span>
                        </div>
                    )}
                    {error && !isLoading && (
                        <div className="p-4 text-red-600">{error}</div>
                    )}
                    {!isLoading && !error && suggestions.length === 0 && debouncedSearchTerm.length >= 2 && (
                        <div className="p-4 text-gray-500">No results found for "{debouncedSearchTerm}".</div>
                    )}
                    {!isLoading && !error && suggestions.length > 0 && (
                        <ul>
                            {suggestions.map((suggestion) => (
                                <li key={suggestion.id} className="border-b border-gray-100 last:border-b-0">
                                    
                                     <Link href={`/store/search?q=${encodeURIComponent(suggestion.name)}`}
                                           className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                                           onClick={() => setShowSuggestions(false)} // Hide on click
                                     >   {suggestion.imageUrl && (
                                        <Image
                                            src={suggestion.imageUrl}
                                            alt="" // Decorative image
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 object-contain rounded-sm mr-3 flex-shrink-0"
                                        />
                                    )}
                                     {!suggestion.imageUrl && ( // Placeholder if no image
                                        <div className="w-8 h-8 bg-gray-200 rounded-sm mr-3 flex-shrink-0"></div>
                                     )}
                                    <span className="truncate text-sm">{suggestion.name}</span></Link>
                                </li>
                            ))}
                             {/* Optional: Link to full search results page */}
                             <li className="border-t border-gray-100">
                                <Link
                                    type="button"
                                    // onClick={() => handleSearchSubmit()}
                                    href={`/store/search?q=${encodeURIComponent(searchTerm.trim())}`}
                                    className="flex items-center w-full px-4 py-2 text-left text-sm font-semibold text-blue-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                >
                                    <SearchIcon/>
                                    <span className="ml-2">See all results for "{debouncedSearchTerm}"</span>
                                </Link>
                             </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}







