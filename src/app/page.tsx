// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { auth } from "../lib/firebaseClient";
// import { useRouter } from "next/navigation";



// export default function Home() {

//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
//         if (currentUser) {
//           try {
//             const token = await currentUser.getIdToken();
//             const response = await fetch(`/api/get-user`, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             });
//             if (response.ok) {
//               const userData = await response.json();
//               setUser(userData);
//             } else {
//               router.push("/login");
//             }
//           } catch (error) {
//             router.push("/login");
//           }
//         } else {
//           router.push("/login");
//         }
//         setLoading(false);
//       });
  
//       return () => unsubscribe();
//     };
  
//     fetchUserData();
//   }, [router]);
  


//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1>Welcome</h1>
//     </main>
//   );
// }














"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebaseClient";
import { useRouter } from "next/navigation";
import LoaderSpinner from '../components/Loader';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`/api/get-user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              router.push("/login");
            }
          } catch (error) {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    // Show a loading spinner or message while authentication is being fetched
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderSpinner size={40}/> {/* Add your loader component here */}
        {/* <h1>Loading...</h1> */}
      </div>
    );
  }

  // Once loading is done, render the page content
  if (!user) {
    return null; 
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome</h1>
    </main>
  );
}
