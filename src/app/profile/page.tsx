
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
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Spinner } from "@nextui-org/react";
import UserModal from "./Modal";
import UserPosts from './Posts';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(null);
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
    return <Spinner className="flex justify-center p-8"/>;
  }

  return (
    <main className={styles.profilePage}>
      <Back />
      <div className="float-end">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="faded">Menu</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" variant="faded">
            <DropdownItem key="edit" textValue="Edit Profile">
              <Link href="/profile/edit">Edit Profile</Link>
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              onPress={handleSignOut}
              color="danger"
              textValue="Signout"
            >
              Signout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className={styles.profileHeader}>
        <Image
          className={styles.profileImage}
          width={150}
          height={150}
          // src={user.photoURL || "/default.webp"}
          src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}
          alt="Profile"
          priority
        />
        <div className={styles.profileInfo}>
          <p className={styles.username}>
            @{user.username} {user.verified && <span className={`material-symbols-outlined ${styles.verifiedIcon}`}>
verified
</span> }
            {user.quixxleBadge && <span>🎖️</span>}
          </p>
          <h2 className={styles.profileName}>{user.displayName}</h2>
          <p className={styles.bio}>{user.bio}</p>
          <div className={styles.stats}>
            <Button variant="flat" onPress={() => setModalType("followers")} className={styles.statItem}>
              <strong>{user.followersCount}</strong> Followers
            </Button>
            <Button variant="flat" onPress={() => setModalType("following")} className={styles.statItem}>
              <strong>{user.followingCount}</strong> Following
            </Button>
          </div>
        </div>
        
      </div><UserPosts uid={user.uid} />

      {modalType && (
        <UserModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
    </main>
  );
};

export default ProfilePage;
