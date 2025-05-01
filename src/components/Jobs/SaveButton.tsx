// src/components/SaveJobButton.tsx (or src/components/Jobs/SaveButton.tsx)
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; 
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import { Bookmark, BookmarkBorder} from "@mui/icons-material";

interface SaveJobButtonProps {
    jobId: string;
    initialIsSaved: boolean;
}

export default function SaveJobButton({ jobId, initialIsSaved }: SaveJobButtonProps) {
    // State for the saved status, initialized from the prop
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Get user auth state

    // Effect to sync state if the initial prop changes after mount
    // (e.g., due to fast navigation where component might be reused)
    useEffect(() => {
        setIsSaved(initialIsSaved);
    }, [initialIsSaved]);

    const handleSaveToggle = async () => {
        if (!user) {
            alert("Please log in to save jobs.");
            // Optionally redirect or show a more integrated login prompt
            return;
        }

        setIsLoading(true);
        setError(null);
        // Store previous state in case of API failure
        const previousIsSaved = isSaved;

        try {
            // Use the correct API endpoint for saving/unsaving
            const response = await fetch('/api/v1/jobs/save', { // Adjusted endpoint if needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include Authorization header if your save API expects it instead of cookies
                    // 'Authorization': `Bearer ${await user.getIdToken()}` // Example for Firebase Auth client
                },
                body: JSON.stringify({ jobId }),
            });

            if (!response.ok) {
                 // Handle specific errors like 401 Unauthorized
                 if (response.status === 401) {
                    setError("Authentication failed. Please log in again.");
                    // Optionally trigger re-authentication or redirect
                 } else {
                    const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
                    throw new Error(errorData.error || `Failed to update save status.`);
                 }
                 // Revert state on failure
                 setIsSaved(previousIsSaved);

            } else {
                 const data = await response.json();
                 // Update state based *only* on the successful API response's 'saved' field
                 if (typeof data.saved === 'boolean') {
                     setIsSaved(data.saved);
                 } else {
                    // Fallback if response format is unexpected, revert state
                    console.warn("API response missing 'saved' boolean:", data);
                    setIsSaved(previousIsSaved);
                    setError("Received an unexpected response from server.");
                 }
            }

        } catch (err: any) {
            console.error("Save Job Error:", err);
            setError(err.message || "An error occurred while updating save status.");
            // Revert state on error
            setIsSaved(previousIsSaved);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine button text and style based on the `isSaved` state
    const buttonText = isSaved ? <Bookmark/> : <BookmarkBorder/> ;

    return (
        <div className="flex flex-col items-center"> 
        <Tooltip title={isSaved ? "Unsave Job" : "Save Job"} >
             <IconButton
                onClick={handleSaveToggle}
                disabled={isLoading || !user} // Disable if loading or not logged in
                aria-live="polite"
                aria-label={isSaved ? `Unsave job: ${jobId}` : `Save job: ${jobId}`} // Better accessibility
            >
               
                {isLoading ? <CircularProgress size={20} />: buttonText}
            </IconButton>
        </Tooltip>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {!user && !isLoading && <p className="text-gray-500 text-xs mt-1">Log in to save</p>}
        </div>
    );
}









