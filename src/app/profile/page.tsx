
// // app/profile/page
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import Link from "next/link";
// import { auth } from "../../lib/firebaseClient";
// import { useRouter } from "next/navigation";
// // import { VscVerifiedFilled } from "react-icons/vsc";
// import Image from "next/image";
// import styles from "./ProfilePage.module.css";
// import Back from "@/components/BackButton";
// import {
//   Box,
//   Button,
//   Typography,
//   Avatar,
//   IconButton,
//   Menu,
//   MenuItem,
//   Tooltip,
// } from '@mui/material';
// import UserModal from "./Modal";
// import UserPosts from './Posts';

// const ProfilePage: React.FC = () => {
//   const [user, setUser] = useState<any>(null);
//   const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
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
//             }
//           } catch (error) {
//             router.push("/signin");
//           }
//         }
//       });

//       return () => unsubscribe();
//     };

//     fetchUserData();
//   }, [router]);

//   const handleSignOut = async () => {
//     try {
//       await auth.signOut();
//       router.push("/signin");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   if (!user) {
//     return <Spinner className="flex justify-center p-8"/>;
//   }

//   return (
//     <main className={styles.profilePage}>
//       <Back />
//       <div className="float-end">
//         <Dropdown>
//           <DropdownTrigger>
//             <Button variant="flat">Menu</Button>
//           </DropdownTrigger>
//           <DropdownMenu aria-label="Static Actions" variant="flat">
//             <DropdownItem key="edit" textValue="Edit Profile">
//               <Link href="/profile/edit">Edit Profile</Link>
//             </DropdownItem>
//             <DropdownItem
//               key="delete"
//               className="text-danger"
//               onClick={handleSignOut}
//               color="danger"
//               textValue="Signout"
//             >
//               Signout
//             </DropdownItem>
//           </DropdownMenu>
//         </Dropdown>
//       </div>

//       <div className={styles.profileHeader}>
//         <Image
//           className={styles.profileImage}
//           width={150}
//           height={150}
//           // src={user.photoURL || "/default.webp"}
//           src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}
//           alt="Profile"
//           priority
//         />
//         <div className={styles.profileInfo}>
//           <p className={styles.username}>
//             @{user.username} {user.verified && <span className={`material-symbols-outlined ${styles.verifiedIcon}`}>
// verified
// </span> }
//             {user.quixxleBadge && <span>🎖️</span>}
//           </p>
//           <h2 className={styles.profileName}>{user.displayName}</h2>
//           <p className={styles.bio}>{user.bio}</p>
//           <div className={styles.stats}>
//             <Button variant="flat" onClick={() => setModalType("followers")} className={styles.statItem}>
//               <strong>{user.followersCount}</strong> Followers
//             </Button>
//             <Button variant="flat" onClick={() => setModalType("following")} className={styles.statItem}>
//               <strong>{user.followingCount}</strong> Following
//             </Button>
//           </div>
//         </div>
        
//       </div><UserPosts uid={user.uid} />

//       {modalType && (
//         <UserModal
//           isOpen={!!modalType}
//           onClose={() => setModalType(null)}
//           type={modalType}
//         />
//       )}
//     </main>
//   );
// };

// export default ProfilePage;












// app/profile/page
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
// import { VscVerifiedFilled } from "react-icons/vsc";
import Image from "next/image";
import styles from "./ProfilePage.module.css";
import Back from "@/components/BackButton";
import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import UserModal from "./Modal";
import UserPosts from './Posts';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };


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
            }
          } catch (error) {
            router.push("/signin");
          }
        }
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return 'loading...';
  }

    return (
    <Box sx={{ padding: 2 }}>
      {/* Back Button */}
      <Button onClick={() => router.back()} sx={{ marginBottom: 2 }}>
        Back
      </Button>

      {/* Menu Dropdown */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="Menu">
          <IconButton onClick={handleMenuOpen}>
            {/* <MenuIcon /> */}menu
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => router.push('/profile/edit')}>Edit Profile</MenuItem>
          <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
            Signout
          </MenuItem>
        </Menu>
      </Box>

      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 4 }}>
        <Avatar
          src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}
          alt="Profile"
          sx={{ width: 150, height: 150 }}
        />
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            @{user.username}
            {user.verified && 'verified'}
            {user.quixxleBadge && <span>🎖️</span>}
          </Typography>
          <Typography variant="h4">{user.displayName}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 1 }}>
            {user.bio}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button onClick={() => setModalType("followers")}>
              <strong>{user.followersCount}</strong> Followers
            </Button>
            <Button onClick={() => setModalType("following")}>
              <strong>{user.followingCount}</strong> Following
            </Button>
          </Box>
        </Box>
      </Box>

      {/* User Posts */}
      <UserPosts uid={user.uid} />

      {/* Modal for Followers/Following */}
      {modalType && (
        <UserModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
    </Box>
  );
}

export default ProfilePage;
