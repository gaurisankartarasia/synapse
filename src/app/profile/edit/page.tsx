// src/app/profile/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { auth } from "../../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoaderSpinner from '../../../components/Loader';
import styles from "./EditProfile.module.css"; 

const ProfileEditPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
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
            setDisplayName(userData.displayName || "");
            setUsername(userData.username || "");
            setBio(userData.bio || "");
            setProfileImagePreview(userData.photoURL || null);
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
    };

    fetchUserData();
  }, [router]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfileImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const formData: Record<string, any> = { token, displayName, username, bio };

      if (profileImage) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (typeof reader.result === "string") {
            const base64data = reader.result.split(",")[1];
            formData.profileImage = base64data;

            await updateProfile(formData);
          }
        };
        reader.readAsDataURL(profileImage);
      } else {
        await updateProfile(formData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const updateProfile = async (formData: any) => {
    const response = await fetch(`/api/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Profile updated successfully!");
      router.push("/profile");
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  };

  if (loading) {
    return <LoaderSpinner size={20}/>;
  }

  if (!user) {
    return null;
  }

  // return (
  //   <div>
  //     <h2>Edit Profile</h2>
  //     {profileImagePreview && (
  //           <div>
  //             <Image
  //               src={profileImagePreview}
  //               alt="Profile Preview"
  //               width={100}
  //               height={100}
  //               style={{background:'transparent'}}
  //             />
  //           </div>
  //         )}
  //          <label>
  //           Profile Image:
  //           <input
  //             type="file"
  //             accept="image/*"
  //             onChange={handleProfileImageChange}
  //           />
  //         </label>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label>
  //           Display Name:
  //           <input
  //             type="text"
  //             value={displayName}
  //             onChange={(e) => setDisplayName(e.target.value)}
  //           />
  //         </label>
  //       </div>
  //       <div>
  //         <label>
  //           Username (limited to 2 updates every 15 days):
  //           <input
  //             type="text"
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //           />
  //         </label>
  //       </div>
  //       <div>
  //         <label>
  //           Bio:
  //           <textarea
  //             value={bio}
  //             onChange={(e) => setBio(e.target.value)}
  //           />
  //         </label>
  //       </div>
  //       <div>
         
        
  //       </div>
  //       <button type="submit">Save Changes</button>
  //     </form>
  //     <button onClick={() => router.push("/profile")}>Cancel</button>
  //   </div>
  // );

  return (
    <div className={styles.editProfile}>
      <h2>Edit Profile</h2>

      {/* Profile image preview */}
      {profileImagePreview && (
        <div className={styles.profileImagePreview}>
          <Image
            src={profileImagePreview}
            alt="Profile Preview"
            width={100}
            height={100}
            style={{ background: "transparent", borderRadius: "50%" }}
          />
        </div>
      )}

      {/* Profile image input */}
      <label className={styles.profileImageLabel}>
        Profile Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
      </label>

      {/* Edit profile form */}
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>
            Username (limited to 2 updates every 15 days):
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
        </div>

        {/* Save and Cancel buttons */}
        <div className={styles.buttons}>
          <button type="submit" className={styles.saveButton}>Save Changes</button>
          <button type="button" className={styles.cancelButton} onClick={() => router.push("/profile")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditPage;
