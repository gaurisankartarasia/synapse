// app/profile/page
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import {Button} from '@mui/material';


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
    <div>
      {/* Back button */}
      <Button  onClick={() => router.back()} >
        Back
      </Button>

      {/* Menu Dropdown */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleMenuOpen}>
            {/* <MenuIcon /> */}menu
          </Button>
        <div
          // anchorEl={menuAnchorEl}
          // open={Boolean(menuAnchorEl)}
          // onClose={handleMenuClose}
        >
          <Button onClick={() => router.push('/profile/edit')}>Edit Profile</Button>
          <li onClick={handleSignOut} style={{ color: 'error.main' }}>
            Signout
          </li>
        </div>
      </div>

      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 4 }}>
        <img
          src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}
          alt="Profile"
          style={{ width: 150, height: 150 }}
        />
        <div>
          <p  style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            @{user.username}
            {user.verified && 'verified'}
            {user.quixxleBadge && <span>🎖️</span>}
          </p>
          <p >{user.displayName}</p>
          <p color="text.secondary" style={{ marginTop: 1 }}>
            {user.bio}
          </p>
          <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button onClick={() => setModalType("followers")}>
              <strong>{user.followersCount}</strong> Followers
            </Button>
            <Button onClick={() => setModalType("following")}>
              <strong>{user.followingCount}</strong> Following
            </Button>
          </div>
        </div>
      </div>

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
    </div>
  );
}

export default ProfilePage;
