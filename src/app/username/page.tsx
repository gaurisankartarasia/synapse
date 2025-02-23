// // src/app/username/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { setUsername } from '@/redux/features/userSlice';

// interface SerializableUser {
//     uid: string;
//     email: string | null;
//     displayName: string | null;
//     profilePhotoURL: string | null;
//     emailVerified: boolean;
//   }

// export default function UsernamePage() {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
// const { user } = useSelector((state: RootState) => state.auth) as { user: SerializableUser | null };

//   const { loading, error } = useSelector((state: RootState) => state.user);
  
//   const [username, setUsernameInput] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (user?.uid) {
//       try {
//         const resultAction = await dispatch(
//           setUsername({ uid: user.uid, username })
//         ).unwrap();
//         router.push('/profile');
//       } catch (err) {
//         console.error('Failed to set username:', err);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-md shadow">
//         <h2 className="text-3xl font-bold text-center text-black">Choose Username</h2>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium r">
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               required
//               className="mt-1 block w-full border text-black rounded-md shadow-sm p-2"
//               value={username}
//               onChange={(e) => setUsernameInput(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             {loading ? 'Setting username...' : 'Set Username'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }





// src/app/username/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setUsername } from '@/redux/features/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function UsernamePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [username, setUsernameInput] = useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(setUsername({ username })).unwrap();
      router.push('/profile');
    } catch (err) {
      console.error('Failed to set username:', err);
    }
  };

  


  return (
    <div className="min-h-[700px] flex items-center justify-center ">
      <Card className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold text-cente">Choose Username</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              required
              className="mt-1 block w-full p-2"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 "
          >
            {loading ? 'Setting username...' : 'Set Username'}
          </Button>
        </form>



      </Card>
    </div>
  );
}





