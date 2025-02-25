// // src/components/LogoutButton.tsx
// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { auth, signOut } from '@/lib/firebaseClient'

// const LogoutButton: React.FC = () => {

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       const response = await fetch('/api/auth/signout', {
//         method: 'POST',
//       });

//       if (response.ok) {
//         // Redirect or refresh the page after logging out
//         // router.push('/signin'); 
//         window.location.href = '/signin'
//       } else {
//         console.error('Failed to log out');
//       }
//     } catch (error) {
//       console.error('An error occurred while logging out:', error);
//     }
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className='text-red-500'
//       title='Logout from current user'
//     >
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;






// src/components/LogoutButton.tsx
'use client';

import React from 'react';
import { auth, signOut } from '@/lib/firebaseClient';
import axios from 'axios';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);

      const axiosInstance = axios.create({
        baseURL: '/api',
        timeout: 5000,
        withCredentials: true,
      });

      const response = await axiosInstance.post('/auth/signout');

      if (response.status === 200) {
        window.location.href = '/signin';
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error during logout:', error.response?.data || error.message);
      } else {
        console.error('An error occurred while logging out:', error);
      }
    }
  };

  return (
    <button onClick={handleLogout} className="text-red-500" title="Logout from current user">
      Logout
    </button>
  );
};

export default LogoutButton;
