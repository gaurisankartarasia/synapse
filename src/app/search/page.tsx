

"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import './Search.css';

const SearchPageContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Populate searchTerm if there's a query in the URL
    if (searchParams) {
      const query = searchParams.get("q");
      if (query) {
        setSearchTerm(query);
        performSearch(query); // Perform search based on query from URL
      }
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(query)}`);
      const result = await response.json();

      if (response.ok) {
        setSearchResults(result.users || []);
      } else {
        console.error("Search failed:", result.error);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  const handleSearchinputChange = (value: string) => {
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Trigger performSearch after a delay
    debounceTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms debounce delay
  };

  const handleProfileClick = async (uid: string) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const currentUid = currentUser.uid;

      if (currentUid === uid) {
        router.push("/profile");
      } else {
        try {
          const response = await fetch(`/api/get_username_from_uid?uid=${uid}`);
          const result = await response.json();

          if (response.ok && result.username) {
            router.push(`/${result.username}`);
          } else {
            console.error("Failed to fetch username:", result.error);
          }
        } catch (error) {
          console.error("Error fetching username from uid:", error);
        }
      }
    }
  };

  return (
    <main className="main container mx-auto">
      <h2 className="search_page_title">Search</h2>
      <form className="search_form mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input
          className="search_input  max-w-[400px]"
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => handleSearchinputChange(e.target.value)}
        />
      </form>

      {loading && '...'}

      {searchResults.length > 0 && (
        <ul className="search_list">
          {searchResults.map((user) => (
            <div
          
              key={user.uid}
              onClick={() => handleProfileClick(user.uid)}
              className="cursor-pointer search_item "
            >
                
              <img
                // src={user.photoURL || "/default.webp"}
                src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}
                alt={user.username}
                // width={50}
                // height={50}
                // onError={(e) => {
                //   e.currentTarget.src = "/default.webp"; // Set fallback image on error
                // }}
              />

              <div className="search_item_data">
                <h1 className="search_username">@{user.username}</h1>
                <p className="search_displayName">
                  {user.displayName || user.username}
                </p>
              </div>
             
            </div>
          ))}
        </ul>
      )}

      <div className="flex justify-center">
        {searchResults.length === 0 && !loading && <small>No results</small>}
      </div>
    </main>
  );
};

const SearchPage: React.FC = () => (
  <Suspense fallback='...' >
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;
