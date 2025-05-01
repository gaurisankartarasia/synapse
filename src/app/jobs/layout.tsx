import React from 'react';
import Navbar from '@/components/Jobs/Navbar';

export default function JobsPagesLayout({ children }: { children: React.ReactNode }) {
   
    return (
        <div>
          <div className="flex justify-center mt-4">
          <Navbar  />
          </div>
            {children}
        </div>
    );
}