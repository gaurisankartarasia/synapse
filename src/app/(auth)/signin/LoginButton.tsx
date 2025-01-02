// src/components/AuthButton.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, signOutUser } from '@/utils/client-auth';

export default function AuthButton() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <button onClick={user ? handleSignOut : handleSignIn}>
      {user ? 'Sign Out' : 'Sign In with Google'}
    </button>
  );
}