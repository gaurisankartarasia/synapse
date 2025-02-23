"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

const EditProfile = () => {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoURL, setProfilePhotoURL] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user-profile/query");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setBio(data.bio);
        setDisplayName(data.displayName);
        setUsername(data.username);
        setProfilePhotoURL(data.profilePhotoURL);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const options = { maxSizeMB: 0.1, maxWidthOrHeight: 300, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      const compressedURL = URL.createObjectURL(compressedFile);
      setProfilePhoto(compressedFile);
      setProfilePhotoURL(compressedURL);
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("displayName", displayName);
      formData.append("username", username);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await fetch("/api/user-profile/update", {
        method: "POST",
        body: JSON.stringify({ bio, displayName, username, profilePhotoURL }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      router.push("/profile");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500">
            Can be changed twice every 15 days.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Photo</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {profilePhotoURL && <img src={profilePhotoURL} className="w-24 h-24 mt-2 rounded-md" />}
        </div>

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
