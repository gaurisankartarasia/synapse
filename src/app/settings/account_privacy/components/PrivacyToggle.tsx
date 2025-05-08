// // components/PrivacyToggle.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { Switch } from '@mui/material';

// export default function PrivacyToggle() {
//   const [enabled, setEnabled] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPrivacy = async () => {
//       try {
//         const res = await fetch('/api/v1/user/privacy/account_privacy');
//         const data = await res.json();
//         setEnabled(data.status);
//       } catch (error) {
//         console.error('Failed to fetch privacy status:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrivacy();
//   }, []);

//   const handleToggle = async (newValue: boolean) => { // Directly accept boolean
//     try {
//       setEnabled(newValue);
//       await fetch('/api/v1/user/privacy/account_privacy', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newValue }),
//       });
//     } catch (error) {
//       console.error('Failed to update privacy status:', error);
//       setEnabled(!newValue); // Revert on error
//     }
//   };

//   if (loading) return <div>Loading privacy settings...</div>;

//   return (
//     <div className=" p-6 "  >
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-medium">Private Account</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Account privacy status
//           </p>
//         </div>
//         <Switch
//           checked={enabled}
//           onChange={handleToggle} 
         
//         >
//           <span
//             className={`${enabled ? 'translate-x-6' : 'translate-x-1'}
//               inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//           />
//         </Switch>
//       </div>
//     </div>
//   );
// }








// components/PrivacyToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import React from 'react'; 
import MD3Switch from '@/components/Switch';

export default function PrivacyToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // For initial fetch
  const [isUpdating, setIsUpdating] = useState(false); // For update operation

  useEffect(() => {
    const fetchPrivacy = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch('/api/v1/user/privacy/account_privacy'); // Ensure this path matches your API file structure
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setEnabled(data.status); // Assuming GET returns { status: boolean }
      } catch (error) {
        console.error('Failed to fetch privacy status:', error);
        // Handle fetch error appropriately, maybe show a message
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPrivacy();
  }, []);

  // Updated handleToggle to match MUI signature and send correct body
  const handleToggle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newValue = checked;
    const previousValue = enabled;

    // Optimistically update the UI
    setEnabled(newValue);
    setIsUpdating(true); // Indicate update is in progress

    try {
      const res = await fetch('/api/v1/user/privacy/account_privacy', { // Ensure this path matches your API file structure
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // **** FIXED: Send 'isPrivate' key ****
        body: JSON.stringify({ isPrivate: newValue }),
      });

      if (!res.ok) {
         // Try to parse error message from API if available
         let apiError = `API error! status: ${res.status}`;
         try {
            const errorData = await res.json();
            apiError = errorData.error || apiError;
         } catch (parseError) {
            // Ignore if response is not JSON or empty
         }
         throw new Error(apiError);
      }
      // Optional: handle successful response if needed
      // const result = await res.json();
      // console.log('Privacy status updated successfully');

    } catch (error) {
      console.error('Failed to update privacy status:', error);
      // Revert to the previous state on error
      setEnabled(previousValue);
      // Optionally show an error message to the user (e.g., using a toast notification)
      alert(`Error updating privacy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
       setIsUpdating(false); // End update operation
    }
  };

  // Render loading state
  if (loading) return <div className="p-6">Loading privacy settings...</div>;

  // Render component
  return (
    <div className=" p-6 "  >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Private Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Make your account private ({enabled ? 'Currently Private' : 'Currently Public'})
          </p>
        </div>
        <MD3Switch
          checked={enabled}
          onChange={handleToggle}
          disabled={loading || isUpdating}
        />
      </div>
       {isUpdating && <p className="text-sm text-gray-400 mt-1">Updating...</p>} 
    </div>
  );
}