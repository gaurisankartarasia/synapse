
"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from 'next/link';
import { auth } from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Image from 'next/image';
import Modal from "../../components/Modal";
import styles from "./ProfilePage.module.css"; 
import '../globals.css';
import LoaderSpinner from '../../components/Loader';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalContent, setModalContent] = useState<string>(""); // "followers" or "following"
  const [modalData, setModalData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false); // Loader for modal
  const [signingOut, setSigningOut] = useState<boolean>(false); // Loader for signing out
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

  const openModal = useCallback(async (type: string) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`/api/get-${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setModalData(type === "followers" ? data.followers : data.following);
          setModalContent(type);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} data`, error);
    } finally {
      setModalLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const handleUserClick = async (uid: string) => {
    try {
      const response = await fetch(`/api/get_username_from_uid?uid=${uid}`);
      const result = await response.json();

      if (response.ok && result.username) {
        router.push(`/${result.username}`);
      } else {
        console.error("Failed to fetch username:", result.error);
      }
    } catch (error) {
      console.error("Error fetching username from uid:", error);
    }
  };

  if (loading) {
    return  <LoaderSpinner size={20}/>;
  }

  if (!user) {
    return null;
  }

   
    return (
      <main className={styles.profilePage}>
        {/* Profile header section */}
        <div className={styles.profileHeader}>
          <Image
            className={styles.profileImage}
            width={150}
            height={150}
            src={user.photoURL || "/default-profile.png"}
            alt="Profile"
            priority
          />
          <div className={styles.profileInfo}>
          <p className={styles.username}>
              @{user.username} {user.verified && <RiVerifiedBadgeFill size={17} className={styles.verifiedIcon} />}
              {user.quixxleBadge && <span>🎖️</span>}
            </p>
            <h2 className={styles.profileName}>{user.displayName}</h2>
           
            <p className={styles.bio}>{user.bio}</p>
            <div className={styles.stats}>
              <p onClick={() => openModal("followers")} className={styles.statItem}>
                <strong>{user.followersCount}</strong> Followers
              </p>
              <p onClick={() => openModal("following")} className={styles.statItem}>
                <strong>{user.followingCount}</strong> Following
              </p>
            </div>
          </div>
        </div>
  
        {/* Edit and Settings buttons */}
        <div className={styles.actions}>
          <Link href="/profile/edit">
            <button className={styles.editButton}>Edit Profile</button>
          </Link>
          <Link href="/settings">
            <button className={styles.settingsButton}>Settings</button>
          </Link>
          <button
            className={`${styles.logoutButton} ${signingOut && styles.disabled}`}
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? <LoaderSpinner size={20} /> : "Logout"}
          </button>
        </div>
  
        {/* Modal for followers/following */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent === "followers" ? "Followers" : "Following"}>
          {modalLoading ? (
            <LoaderSpinner size={20} />
          ) : (
            <ul className={styles.modalList}>
              {modalData.map((user) => (
                <li key={user.uid} className={styles.modalListItem}>
                  <Image
                    src={user.photoURL || "/default-profile.png"}
                    alt={user.username}
                    width={50}
                    height={50}
                    className={styles.modalImage}
                    onClick={() => handleUserClick(user.uid)}
                  />
                  <div>
                    <p onClick={() => handleUserClick(user.uid)}>{user.username}</p>
                    {user.verified && <RiVerifiedBadgeFill size={17} className={styles.verifiedIcon} />}
                    <p onClick={() => handleUserClick(user.uid)}>{user.displayName}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      </main>
    );

};

export default ProfilePage;
