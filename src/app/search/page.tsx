
// src/app/search/page.tsx
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { OutlinedInput, Card, CardActionArea, CircularProgress } from '@mui/material';

interface SearchResult {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  private: boolean;
}

const SearchPageContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ users: SearchResult[] }>(
        `/api/search?q=${encodeURIComponent(query)}`,
        {
          withCredentials: true // Important: This ensures cookies are sent
        }
      );
      setSearchResults(response.data.users);
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

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleProfileClick = async (uid: string) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      if (currentUser.uid === uid) {
        router.push("/profile");
      } else {
        try {
          const response = await axios.get(`/api/get_username_from_uid?uid=${uid}`);
          if (response.data.username) {
            router.push(`/${response.data.username}`);
          }
        } catch (err) {
          console.error("Error fetching username:", err);
        }
      }
    }
  };

  return (
    <main className="main container mx-auto">
      <h2 className="search_page_title">Search</h2>
      <form className="search_form mx-auto" onSubmit={(e) => e.preventDefault()}>
        <OutlinedInput
          className="search_input max-w-[400px]"
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => handleSearchInputChange(e.target.value)}
        />
      </form>

      {loading && <CircularProgress/>}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {searchResults.length > 0 && (
        <ul className="search_list">
          {searchResults.map((user) => (
            <Card
              key={user.uid}
              onClick={() => handleProfileClick(user.uid)}
              className="cursor-pointer search_item"
            >
              <CardActionArea>
              <img
                src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}
                alt={user.username}
                className="search_avatar"
              />
              <div className="search_item_data">
                <h1 className="search_username">@{user.username}</h1>
                <p className="search_displayName">
                  {user.displayName || user.username}
                </p>
              </div>
              </CardActionArea>
            </Card>
          ))}
        </ul>
      )}

      {searchResults.length === 0 && !loading && !error && (
        <div className="text-center">
          <small>No results</small>
        </div>
      )}
    </main>
  );
};

const SearchPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;