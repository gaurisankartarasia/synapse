'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PageLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed  left-0 w-full z-[100]">
      <div 
        className="h-1 bg-black animate-progress-bar origin-left"
        style={{ 
          transformOrigin: 'left', 
          width: '100%' 
        }}
      />
    </div>
  );
}