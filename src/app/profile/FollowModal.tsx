

// components/UserModal.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "@/components/Modal";
import Image from "next/image";
import VerifiedIcon from '@mui/icons-material/Verified';
// import styles from "./UserModal.module.css";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following";
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, type }) => {
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const router = useRouter();
  const hasFetched = useRef(false); // Prevent duplicate fetch calls

  const fetchModalData = useCallback(async () => {
    if (!isOpen || !auth.currentUser || hasFetched.current) return;
    hasFetched.current = true; // Mark as fetched
    setModalLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`/api/get-${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModalData(type === "followers" ? data.followers : data.following);
      }
    } catch (error) {
      console.error(`Error fetching ${type} data`, error);
    } finally {
      setModalLoading(false);
    }
  }, [isOpen, type]);

  useEffect(() => {
    fetchModalData();
  }, [fetchModalData]);

  useEffect(() => {
    if (!isOpen) {
      hasFetched.current = false; // Reset fetch flag when modal closes
    }
  }, [isOpen]);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === "followers" ? "Followers" : "Following"}>
      {modalLoading ? (
        <CircularProgress/>
      ) : (
        <ul 
        // className={styles.modalList}
        >
          {modalData.map((user) => (
            <li key={user.uid}
            //  className={styles.modalListItem}
             >
              <Image
                src={`/api/proxy?url=${encodeURIComponent(user.profilePhotoURL || "/default.webp")}`}
                alt={user.username}
                width={50}
                height={50}
                // className={styles.modalImage}
                onClick={() => handleUserClick(user.uid)}
              />

              <div>
                <div
                  className="cursor-pointer hover:underline"
                  onClick={() => handleUserClick(user.uid)}
                >
                  {user.username}
                  <p>{user.displayName}</p>
                </div>
              </div>
              {user.verified && <VerifiedIcon/>}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default UserModal;