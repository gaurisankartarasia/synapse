// src/components/LogoutButton.tsx
'use client';

import React from 'react';
import { auth, signOut } from '@/lib/firebaseClient'

const LogoutButton: React.FC = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
      title='Logout from current user'
    >
      Logout
    </button>
  );
};

export default LogoutButton;





