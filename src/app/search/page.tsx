
// // src/app/search/page.tsx

"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {Spinner} from "@/components/ui/spinner"
import {Input} from '@/components/ui/input'
import {VscVerifiedFilled} from 'react-icons/vsc';
import UserSuggestions from "@/components/UserSuggestions/UserSuggestions";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface SearchResult {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isPrivate: boolean;
  isVerified: boolean;
}

const SearchPageContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchParams) {
      const query = searchParams.get("q");
      if (query) {
        setSearchTerm(query);
        performSearch(query);
      }
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/v1/search?q=${encodeURIComponent(query)}`,
        {
          credentials: 'include' // equivalent to withCredentials: true
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.users);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to perform search");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setHasSearched(false);
      setSearchResults([]);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  return (
    <>
    <main className="flex justify-between">
      <div className="w-full lg:w-2/3 p-3">
        <h2 className="font-semibold m-3">Search</h2>
        <form className="" onSubmit={(e) => e.preventDefault()}>
          <Input
            className=""
            type="text"
            placeholder="Search by username or display name"
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
          />
        </form>
        
        <div className="flex justify-center p-5">
          {loading && <Spinner />}
        </div>
        
        {error && <div className="text-red-500 text-center">{error}</div>}

        {searchResults.length > 0 && (
          <ul className="search_list">
            {searchResults.map((user) => (
              <div
                key={user.uid}
                className="cursor-pointer m-2 my-2 hover:bg-accent rounded-xl"
              >
                <Link href={user.username} >
                  <div className="flex gap-3 p-3 ">
                    <Avatar>
                      <AvatarImage src={user.profilePhotoURL} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0,1)}</AvatarFallback>
                    </Avatar>

                    <div className="">
                      <div className="flex items-center gap-1">
                        <h1 className="font-medium">{user.username}</h1>
                        {user.isVerified && <VscVerifiedFilled/>}
                      </div>
                      
                      <p className="opacity-70">
                        {user.displayName || user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </ul>
        )}

        {searchResults.length === 0 && !loading && !error && hasSearched && (
          <div className="text-center p-4">
            <small>No results found</small>
          </div>
        )}

        {!hasSearched && !loading && searchTerm.trim() === "" && (
          <div className="text-center p-4 text-gray-500">
            <p>Search for users by their username or display name</p>
          </div>
        )}
        
      </div>

      <div className="hidden lg:block lg:w-1/3">
        <UserSuggestions />
      </div>
    </main>
    
    </>
  );
};

const SearchPage: React.FC = () => (
  <Suspense fallback={<div className="flex justify-center p-8"><Spinner/></div>}>
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;

