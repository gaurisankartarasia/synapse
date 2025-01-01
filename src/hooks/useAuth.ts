// import { useState, useEffect } from "react";
// import { User } from "firebase/auth";
// import { auth } from "../lib/firebaseClient"; // Import initialized auth instance

// interface AuthState {
//   user: User | null;
//   loading: boolean;
// }

// interface UseAuthReturn extends AuthState {
//   getIdToken: () => Promise<string>;
// }

// export function useAuth(): UseAuthReturn {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     loading: true,
//   });

//   useEffect(() => {
//     return auth.onAuthStateChanged((user) => {
//       setAuthState({
//         user,
//         loading: false,
//       });
//     });
//   }, []);

//   const getIdToken = async (): Promise<string> => {
//     const user = auth.currentUser;
//     if (!user) {
//       throw new Error("No user logged in");
//     }
//     return user.getIdToken();
//   };

//   return {
//     ...authState,
//     getIdToken,
//   };
// }




'use client'
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setAuthState({
        user,
        loading: false,
      });
    });
  }, []);

  const getIdToken = async () => {
    if (!auth.currentUser) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Increased delay
    }
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    return user.getIdToken();
  };

  return {
    ...authState,
    getIdToken,
  };
}