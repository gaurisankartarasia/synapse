import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "../lib/firebaseClient"; // Import initialized auth instance

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface UseAuthReturn extends AuthState {
  getIdToken: () => Promise<string>;
}

export function useAuth(): UseAuthReturn {
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

  const getIdToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user logged in");
    }
    return user.getIdToken();
  };

  return {
    ...authState,
    getIdToken,
  };
}






