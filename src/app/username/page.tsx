
// src/app/username/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import { Button } from "@mui/material";

const UsernamePage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null); // State to manage status messages
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading spinner
  const router = useRouter();

  const handleCheckUsername = async () => {
    setStatus("Checking username availability...");
    setLoading(true); // Show loader
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
        setLoading(false); // Hide loader on error
        setStatus(null);
      } else if (data.available) {
        setStatus("Username available. Saving username...");
        handleSaveUsername();
      } else {
        setError("Username is already taken");
        setLoading(false);
        setStatus(null);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setError("Failed to check username");
      setLoading(false);
      setStatus(null);
    }
  };

  const handleSaveUsername = async () => {
    setStatus("Saving username...");
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
        setStatus("Setting up your profile...");
        router.push("/profile"); // Redirect after saving username
      } else {
        setError(data.error || "Failed to save username");
        setLoading(false); // Hide loader on error
        setStatus(null);
      }
    } catch (error) {
      console.error("Error saving username:", error);
      setError("Failed to save username");
      setLoading(false);
      setStatus(null);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setStatus("Generating default username...");
    try {
      const defaultUsername = auth.currentUser?.displayName
        ?.toLowerCase()
        .replace(/\s+/g, "") || `user_${auth.currentUser?.uid.substring(0, 6)}`;

      setUsername(defaultUsername);
      await handleSaveUsername();
    } catch (error) {
      console.error("Error generating default username", error);
      setError("Failed to generate default username");
      setLoading(false);
      setStatus(null);
    }
  };

  return (
    <div>
      <h2>Create a Username</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {status && <p>{status}</p>} 
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
          }
          disabled={loading} // Disable input while loading
        />
        <Button onClick={handleCheckUsername} disabled={loading}>
          {loading ? "Processing..." : "Save Username"}
        </Button>
        <Button onClick={handleSkip}>Auto suggest</Button>
      </div>
    </div>
  );
};

export default UsernamePage;
