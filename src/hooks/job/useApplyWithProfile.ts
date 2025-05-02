// src/hooks/useApplyWithProfile.ts
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides user object with uid
import { JobProfile } from '@/types/Job/JobProfile'; // Import your JobProfile type

interface ApplyWithProfileOptions {
    jobId: string;
    
}

interface ApplyWithProfileResult {
    apply: (options: ApplyWithProfileOptions) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

export const useApplyWithProfile = (): ApplyWithProfileResult => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const apply = useCallback(async ({ jobId }: ApplyWithProfileOptions) => {
        if (!user) {
            setError("User not authenticated.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            // Step 1: Fetch the user's Job Profile
            const profileResponse = await fetch('/api/user-profile/job'); // Uses cookie implicitly

            if (!profileResponse.ok) {
                const errorData = await profileResponse.json();
                throw new Error(errorData.error || `Failed to fetch job profile (${profileResponse.status})`);
            }

            const { profile }: { profile: JobProfile } = await profileResponse.json();

            // Ensure essential profile data exists (adjust based on your JobProfile type and API needs)
            if (!profile?.uid || !profile?.email) {
                 // Consider if you want defaults or require profile completion
                throw new Error('Missing essential information (Full Name, Email) in your Job Profile.');
            }

            // Step 2: Prepare the payload for the application API
            // This assumes your API endpoint /api/applications will be updated
            // to accept a JSON payload for profile applications.
            const applicationPayload = {
                jobId: jobId,
                // Map data from the fetched profile
                // fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone || null, // Use profile phone or null
                // Assuming profile might contain these URLs. Adjust field names as needed.
                resumeUrl: profile.resumeUrl || null,
                portfolioUrl: profile.portfolioUrl || null, // Example: if you store portfolio URL
                coverLetter: profile.coverLetter || null, // Example: if you store a default cover letter
                // Applicant ID is implicitly known on the backend via the JWT
            };

            // Step 3: Call the application API endpoint (sending JSON)
            const applyResponse = await fetch('/api/v1/jobs/apply/with_profile', { // Use the correct endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Cookie is sent automatically by the browser
                },
                body: JSON.stringify(applicationPayload),
            });

            if (!applyResponse.ok) {
                const errorData = await applyResponse.json();
                throw new Error(errorData.error || `Failed to submit application (${applyResponse.status})`);
            }

            // Application submitted successfully
            setIsSuccess(true);

        } catch (err: any) {
            console.error("Application submission error:", err);
            setError(err.message || 'An unexpected error occurred.');
            setIsSuccess(false); // Ensure success is false on error
        } finally {
            setIsLoading(false);
        }
    }, [user]); // Re-create function if user changes

    return { apply, isLoading, error, isSuccess };
};