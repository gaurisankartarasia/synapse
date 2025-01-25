// components/LoadingProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleBeforeUnload = () => {
      setIsLoading(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Show loading screen until component is mounted
  if (!mounted) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <LoadingScreen isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
};