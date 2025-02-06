
// Updated src/components/GoogleSignInButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithGoogle } from '@/redux/features/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import {Skeleton} from "@mui/material"

export default function GoogleSignInButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // const handleGoogleSignIn = async () => {
  //   try {
  //     await dispatch(signInWithGoogle()).unwrap();
  //     router.push('/');
  //     router.refresh();
  //   } catch (error) {
  //     console.error('Google sign in error:', error);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      const resultAction = await dispatch(signInWithGoogle());
      if (signInWithGoogle.fulfilled.match(resultAction)) {
        const { hasUsername } = resultAction.payload;
        router.push(hasUsername ? '/' : '/username');
      }
    } catch (err) {
      console.error('Google sign in failed:', err);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            
            <Skeleton size={20} color='inherit'/>
          </div>
        ) : (
          <>
           
            Continue with Google
          </>
        )}
      </button>
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
    </div>
  );
}
