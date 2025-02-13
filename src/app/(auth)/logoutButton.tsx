// src/components/LogoutButton.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect or refresh the page after logging out
        // router.push('/signin'); 
        window.location.href = '/signin'
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('An error occurred while logging out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='text-red-500'
    >
      Logout
    </button>
  );
};

export default LogoutButton;






