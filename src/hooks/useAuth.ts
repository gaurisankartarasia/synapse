

// // hooks/useAuth.ts


// import { useState, useEffect, useCallback } from 'react';

// interface User {
//   id: string;
//   email: string;
//   [key: string]: any;
// }

// // Cache key for localStorage
// const AUTH_CACHE_KEY = 'auth_cache';
// const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// interface CacheData {
//   user: User | null;
//   timestamp: number;
// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(() => {
//     // Try to get initial state from cache
//     try {
//       const cached = localStorage.getItem(AUTH_CACHE_KEY);
//       if (cached) {
//         const { user, timestamp }: CacheData = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_EXPIRY) {
//           return user;
//         }
//         localStorage.removeItem(AUTH_CACHE_KEY);
//       }
//     } catch (e) {
//       console.error('Error reading auth cache:', e);
//     }
//     return null;
//   });

//   const [loading, setLoading] = useState(!user);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUser = useCallback(async () => {
//     try {
//       const res = await fetch('/api/auth/verify_jwt', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         if (res.status === 401) {
//           setUser(null);
//           localStorage.removeItem(AUTH_CACHE_KEY);
//           setError('Session expired. Please log in again.');
//           return;
//         }
//         throw new Error(`Authentication failed: ${res.statusText}`);
//       }

//       const data = await res.json();
      
//       // Update cache
//       const cacheData: CacheData = {
//         user: data.user,
//         timestamp: Date.now()
//       };
//       localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));
      
//       setUser(data.user);
//       setError(null);
//     } catch (err: any) {
//       console.error('Auth Error:', err);
//       setError(err.message);
//       setUser(null);
//       localStorage.removeItem(AUTH_CACHE_KEY);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     let timeoutId: NodeJS.Timeout;

//     const initAuth = async () => {
//       // Only fetch if we don't have a cached user
//       if (!user) {
//         await fetchUser();
//       }
      
//       if (mounted) {
//         // Set up the refresh interval
//         timeoutId = setInterval(fetchUser, CACHE_EXPIRY);
//       }
//     };

//     initAuth();

//     return () => {
//       mounted = false;
//       if (timeoutId) clearInterval(timeoutId);
//     };
//   }, [fetchUser, user]);

//   const refresh = useCallback(() => {
//     setLoading(true);
//     return fetchUser();
//   }, [fetchUser]);

//   return {
//     user,
//     loading,
//     error,
//     refresh,
//     isAuthenticated: !!user
//   };
// }




import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

// Cache settings
const AUTH_CACHE_KEY = "auth_cache";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  user: User | null;
  timestamp: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (cached) {
        const { user, timestamp }: CacheData = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return user;
        }
        localStorage.removeItem(AUTH_CACHE_KEY);
      }
    } catch (e) {
      console.error("Error reading auth cache:", e);
    }
    return null;
  });

  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/auth/verify_jwt", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      // Update cache
      const cacheData: CacheData = {
        user: data.user,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));

      setUser(data.user);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem(AUTH_CACHE_KEY);
          setError("Session expired. Please log in again.");
          return;
        }
        setError(error.response?.data?.message || "Authentication failed.");
      } else {
        setError("An unexpected error occurred.");
      }

      console.error("Auth Error:", error);
      setUser(null);
      localStorage.removeItem(AUTH_CACHE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let refreshInterval: NodeJS.Timeout;

    const initAuth = async () => {
      if (!user) {
        await fetchUser();
      }

      if (isMounted) {
        refreshInterval = setInterval(fetchUser, CACHE_EXPIRY);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [fetchUser, user]);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refresh,
    isAuthenticated: !!user,
  };
}
