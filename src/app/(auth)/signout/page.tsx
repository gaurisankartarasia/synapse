'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, signOut } from '@/lib/firebaseClient';
import CircularProgress from '@mui/material/CircularProgress';

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const signout = async () => {
      try {
        await signOut(auth);
  const res =      await fetch('/api/auth/signout', {
          method: 'POST',
        });

        if(res.ok){
            window.location.href='/signin'
            router.replace('/signin');
                }
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    signout();

  }, [router]);

  return ( 

  <section className='flex items-center justify-center h-96'> 
  <div> 

    <div className='flex items-center justify-center'> <CircularProgress  /></div>
   
    <p>Signing out...</p>
  </div>
   
    </section>
 

  )
  
 
};

export default SignOutPage;
