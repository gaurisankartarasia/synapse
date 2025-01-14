// "use client";
// import React, { useState, useEffect } from "react";
// import { auth } from "../../lib/firebaseClient";
// import { useRouter } from "next/navigation";
// import DeveloperCard from '@/components/DeveloperCard'

// const SettingsPage: React.FC = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isPrivate, setIsPrivate] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const currentUser = auth.currentUser;

//       // Conditional Fetching: Fetch data only if the user is authenticated
//       if (currentUser) {
//         try {
//           const token = await currentUser.getIdToken();
//           const response = await fetch(`/api/get-user`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           if (response.ok) {
//             const userData = await response.json();
//             setUser(userData);
//             setIsPrivate(userData.private || false);
//           } else {
//             console.error("Failed to fetch user data", response.statusText);
//             // Client-side navigation for a smoother UX
//             router.push("/profile"); 
//           }
//         } catch (error) {
//           console.error("Error fetching user data", error);
//           router.push("/profile"); 
//         }
//       } else {
//         // If not authenticated, navigate to profile immediately
//         router.push("/profile"); 
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, [router])

//   const handleTogglePrivacy = async () => {
//     if (user) {
//       try {
//         const token = await auth.currentUser?.getIdToken();
//         const response = await fetch(`/api/update-privacy`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ token, private: !isPrivate }),
//         });

//         if (response.ok) {
//           setIsPrivate(!isPrivate);
//           alert("Privacy settings updated!");
//         } else {
//           const errorData = await response.json();
//           alert(`Error: ${errorData.error}`);
//         }
//       } catch (error) {
//         console.error("Error updating privacy settings:", error);
//         alert("Failed to update privacy settings");
//       }
//     }
//   };

//   if (loading) {
//     return 'Loading...';
//   }

//   return (
//     <div>
//       <h2>Settings</h2>
//       <div>
//         <label>
//           <input
//             type="checkbox"
//             checked={isPrivate}
//             onChange={handleTogglePrivacy}
//           />
//           Private Profile
//         </label>
        
//       </div>
//      <DeveloperCard

//      name="Gauri"
//      image="/default.webp"
//      bio="hello"
//      />
//     </div>
//   );
// };

// export default SettingsPage;


"use client";
import React, { useState, useEffect } from "react";
import { auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import DevelopersPage from '@/components/DeveloperPage';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Function to handle authentication state changes
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
            setIsPrivate(userData.private || false);
          } else {
            console.error("Failed to fetch user data", response.statusText);
            router.push("/profile");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
          router.push("/profile");
        }
      } else {
        router.push("/profile");
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [router]);

  const handleTogglePrivacy = async () => {
    if (user) {
      try {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch(`/api/update-privacy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, private: !isPrivate }),
        });

        if (response.ok) {
          setIsPrivate(!isPrivate);
          alert("Privacy settings updated!");
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error updating privacy settings:", error);
        alert("Failed to update privacy settings");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handleTogglePrivacy}
          />
          Private Profile
        </label>
      </div>
      <DevelopersPage
      />
    </div>
  );
};

export default SettingsPage;
