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
        <div className='flex space-x-2 justify-center dark:invert m-3'>
  	<div className='h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	<div className='h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
	<div className='h-1.5 w-1.5 bg-black rounded-full animate-bounce'></div>
</div>
      </div>
    </div>
  );
};

export default LoadingScreen;