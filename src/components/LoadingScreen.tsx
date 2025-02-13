// components/LoadingScreen.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setShow(true);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-300">
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16 animate-pulse">
          <Image
            src="/favicon.ico" 
            alt="Synapse Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <b>Synapse</b>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/80 [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/80 [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/80" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;