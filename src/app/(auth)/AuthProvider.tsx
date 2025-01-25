
// src/components/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from '@/redux/features/authSlice';
import { checkUsername } from '@/redux/features/userSlice';


export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { username } = useSelector((state: RootState) => state.user);

// useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       // Serialize the user before dispatching
//       const serializedUser = firebaseUser ? {
//         uid: firebaseUser.uid,
//         email: firebaseUser.email,
//         displayName: firebaseUser.displayName,
//         photoURL: firebaseUser.photoURL,
//         emailVerified: firebaseUser.emailVerified
//       } : null;
      
//       dispatch(setUser(serializedUser));
      
//       if (firebaseUser) {
//         try {
//           const resultAction = await dispatch(checkUsername(firebaseUser.uid));
//           if (checkUsername.fulfilled.match(resultAction)) {
//                         const username = resultAction.payload;
                        
//                         // Redirect logic
//                         if (!username && pathname !== '/username') {
//                           router.push('/username');
//                         } else if (username && pathname === '/username') {
//                           router.push('/profile');
//                         }
//                       }
//         } catch (error) {
//           console.error('Error checking username:', error);
//         }
//       }
//     });
  
//     return () => unsubscribe();
//   }, [dispatch, router, pathname]);


// src/components/AuthProvider.tsx
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const serializedUser = firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      } : null;
      
      dispatch(setUser(serializedUser));
      
      if (firebaseUser && pathname !== '/signin' && pathname !== '/signup') {
        try {
          const resultAction = await dispatch(checkUsername(firebaseUser.uid));
          if (checkUsername.fulfilled.match(resultAction)) {
            const username = resultAction.payload;
            
            // Only redirect if not already on the correct page
            if (!username && pathname !== '/username') {
              router.push('/username');
            }
          }
        } catch (error) {
          console.error('Error checking username:', error);
        }
      }
    });
  
    return () => unsubscribe();
  }, [dispatch, router, pathname]);

  return <>{children}</>;
}