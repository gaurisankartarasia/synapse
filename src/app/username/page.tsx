// src/app/username/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";

const UsernamePage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckUsername = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch("/api/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to check username");
      } else if (data.available) {
        handleSaveUsername();
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setError("Failed to check username");
    }
  };

  const handleSaveUsername = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await fetch("/api/save-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, token }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/profile");
      } else {
        setError(data.error || "Failed to save username");
      }
    } catch (error) {
      console.error("Error saving username:", error);
      setError("Failed to save username");
    }
  };

  const handleSkip = async () => {
    try {
      const defaultUsername = auth.currentUser?.displayName
        ?.toLowerCase()
        .replace(/\s+/g, "") || `user_${auth.currentUser?.uid.substring(0, 6)}`;

      setUsername(defaultUsername);
      await handleSaveUsername();
    } catch (error) {
      console.error("Error generating default username", error);
      setError("Failed to generate default username");
    }
  };

  return (
    <div>
      <h2>Create a Username</h2>
      {error && <p>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
        />
        <button onClick={handleCheckUsername}>Save Username</button>
        <button onClick={handleSkip}>Skip</button>
      </div>
    </div>
  );
};

export default UsernamePage;
