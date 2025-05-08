
// // src/components/profile/ProfileView.tsx
// "use client";

// import React, { useState, useEffect, useCallback, Suspense } from 'react';
// import dynamic from 'next/dynamic';
// import {
//     Box,
//     Button,
//     CircularProgress,
//     Alert,
//     Typography,
//     Paper, // Keep Paper import
//     Stack
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// // Import the base type and the specific API payload type
// // Make sure the path @/types/Job/JobProfile is correct
// import { JobProfile } from '@/types/Job/JobProfile';
// // Import the type expected by the onSubmit prop of ProfileForm
// import { JobProfileApiPayload } from '@/types/Job/JobProfile'; // Adjust path if needed, usually types are separate
// import ProfileDisplay from '@/components/Jobs/profile/ProfileDisplay';

// import { useProfile } from "@/hooks/useProfile";

// // Dynamically import the form for code splitting
// const DynamicProfileForm = dynamic(() => import('@/components/Jobs/profile/ProfileForm'), {
//     loading: () => <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>,
//     ssr: false, // Form is interactive, no need to SSR
// });

// const ProfileView = () => {
//     const [profile, setProfile] = useState<JobProfile | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//       const { profile: currentProfile } = useProfile();

//     // --- Data Fetching ---
//     const fetchProfile = useCallback(async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//             // Ensure this API endpoint is correct
//             const response = await fetch('/api/v1/user-profile/job');
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Failed to fetch profile (${response.status})`);
//             }
//             const data = await response.json();
//             setProfile(data.profile || {});
//         } catch (err: any) {
//             console.error("Fetch error:", err);
//             setError(err.message || 'An unexpected error occurred while fetching the profile.');
//             setProfile(null);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchProfile();
//     }, [fetchProfile]);

//     // --- Data Submission ---
//     // ***** FIX: Change the parameter type here *****
//     const handleSaveProfile = async (apiPayload: JobProfileApiPayload) => {
//         setIsSubmitting(true);
//         setError(null);
//         try {
//             // Ensure this API endpoint is correct
//             const response = await fetch('/api/v1/user-profile/job', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 // Send the apiPayload received from the form directly
//                 body: JSON.stringify(apiPayload),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Failed to save profile (${response.status})`);
//             }

//             const result = await response.json();
//             // Ensure result.profile matches the JobProfile structure
//             setProfile(result.profile as JobProfile);
//             setIsEditing(false);

//         } catch (err: any) {
//             console.error("Save error:", err);
//             setError(err.message || 'An unexpected error occurred while saving the profile.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // --- Toggle Edit Mode ---
//   const handleEditToggle = () => {
//         setIsEditing((prev) => !prev);
//         setError(null);
//     }

//     // --- Render Logic ---
//     const renderContent = () => {
//         if (isLoading) {
//             return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
//         }

//         if (error && !isEditing) {
//             return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
//         }

//         if (isEditing) {
//             return (
//                 <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}>
//                     {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//                     <DynamicProfileForm
//                         initialData={profile}
//                         // Pass the correctly typed handleSaveProfile function
//                         onSubmit={handleSaveProfile}
//                         onCancel={handleEditToggle}
//                         isSubmitting={isSubmitting}
//                     />
//                 </Suspense>
//             )
//         } else {
//             if (!profile || Object.keys(profile).length === 0) {
//                 return (
//                     <Paper sx={{ p: 3, textAlign: 'center' }}>
//                         <Typography sx={{ mb: 2 }}>Your job profile is empty.</Typography>
//                         <Button variant="contained" onClick={handleEditToggle} startIcon={<EditIcon />}>
//                             Create Profile
//                         </Button>
//                     </Paper>
//                 )
//             }
//             return <ProfileDisplay profile={profile} currentProfile={currentProfile?? undefined}     />;
//         }
//     }

//     return (
//         <Box sx={{ my: 3 }}>
//             <Stack direction="row" justifyContent="end" alignItems="center" mb={2}>
               
//                 {!isLoading && !isEditing && profile && Object.keys(profile).length > 0 && (
//                     <Button  onClick={handleEditToggle} startIcon={<EditIcon fontSize='small' />}>
//                         Edit Profile
//                     </Button>
//                 )}
//             </Stack>
//             {renderContent()}
//         </Box>
//     );
// };

// export default ProfileView;






// src/components/profile/ProfileView.tsx
"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Import Next.js navigation hooks
import {
    Box,
    Button,
    CircularProgress,
    Alert,
    Typography,
    Paper,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { JobProfile } from '@/types/Job/JobProfile';
import { JobProfileApiPayload } from '@/types/Job/JobProfile';
import ProfileDisplay from '@/components/Jobs/profile/ProfileDisplay';
import { useProfile } from "@/hooks/useProfile";

const DynamicProfileForm = dynamic(() => import('@/components/Jobs/profile/ProfileForm'), {
    loading: () => <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>,
    ssr: false,
});

const ProfileView = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams(); // Hook to read current search params

    const [profile, setProfile] = useState<JobProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Initialize isEditing based on the presence of 'edit' param in the URL
    const [isEditing, setIsEditing] = useState<boolean>(() => searchParams.get('edit') === 'true');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { profile: currentProfile } = useProfile();

    // --- Data Fetching ---
    const fetchProfile = useCallback(async () => {
        // Only set loading true if not already editing (initial load)
        // If starting in edit mode, profile might already be partially known or fetched differently
        if (!isEditing) {
          setIsLoading(true);
        }
        setError(null);
        try {
            const response = await fetch('/api/v1/user-profile/job');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch profile (${response.status})`);
            }
            const data = await response.json();
            setProfile(data.profile || {});
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || 'An unexpected error occurred while fetching the profile.');
            setProfile(null); // Clear profile on fetch error
        } finally {
            // Ensure loading is false even if started in edit mode
            setIsLoading(false);
        }
    }, [isEditing]); // Add isEditing dependency if fetch logic differs

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // --- Effect to Sync URL with isEditing state ---
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentEditParam = params.get('edit');

        if (isEditing) {
            // If entering edit mode, add ?edit=true if not already present
            if (currentEditParam !== 'true') {
                params.set('edit', 'true');
                const newUrl = `${pathname}?${params.toString()}`;
                router.replace(newUrl, { scroll: false }); // Use replace to not add history, scroll: false to prevent jump
            }
        } else {
            // If exiting edit mode, remove ?edit if present
            if (currentEditParam !== null) { // Check if 'edit' exists at all
                params.delete('edit');
                const newQueryString = params.toString();
                const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname; // Remove '?' if no params left
                router.replace(newUrl, { scroll: false }); // Use replace
            }
        }
        // Dependencies: run when isEditing state changes, or if pathname/router/searchParams instance changes
    }, [isEditing, pathname, router, searchParams]);

    // --- Data Submission ---
    const handleSaveProfile = async (apiPayload: JobProfileApiPayload) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch('/api/v1/user-profile/job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to save profile (${response.status})`);
            }

            const result = await response.json();
            setProfile(result.profile as JobProfile);
            setIsEditing(false); // Exit editing mode - this triggers the useEffect above to update URL

        } catch (err: any) {
            console.error("Save error:", err);
            setError(err.message || 'An unexpected error occurred while saving the profile.');
            // Keep editing mode true on error so user can see the form/error
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Toggle Edit Mode Handler ---
    const handleEditToggle = () => {
        // Simply toggle the state. The useEffect will handle the URL update.
        setIsEditing((prev) => !prev);
        // Clear error when toggling mode manually
        if (!isEditing) { // Clear error only when entering edit mode via button
             setError(null);
        }
         // If currently displaying an error and user clicks edit/create, fetch fresh data
         if (error && !isEditing) {
             fetchProfile();
         }
    };

    // --- Render Logic ---
    const renderContent = () => {
        // Show loading indicator only during initial fetch, not when toggling edit state usually
        if (isLoading && !isEditing && !profile) { // More specific loading condition
            return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
        }

        // Show main error only when NOT editing (form handles its own errors)
        // Only show fetch error if not loading and not editing
        if (error && !isEditing && !isLoading) {
             // If profile exists show error above display, otherwise show error standalone
             if (!profile || Object.keys(profile).length === 0) {
                return (
                     <Paper sx={{ p: 3, textAlign: 'center' }}>
                          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                          <Button variant="outlined" onClick={fetchProfile}>Retry Fetch</Button>
                     </Paper>
                 );
             }
             // If profile exists, error might be from a previous failed save, show above content
             // This might be cleared when entering edit mode again.
        }


        if (isEditing) {
            // Even if loading initially, if we are editing, show the form (might need initialData)
            return (
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}>
                    {/* Display submission errors within the form context */}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <DynamicProfileForm
                        // Provide initialData, handle case where profile is null during initial load + edit URL
                        initialData={profile ?? {}} // Pass empty object if profile is null
                        onSubmit={handleSaveProfile}
                        onCancel={handleEditToggle} // Cancel button also uses the toggle handler
                        isSubmitting={isSubmitting}
                    />
                </Suspense>
            );
        } else {
            // Successfully loaded state, not editing
             if (!profile || Object.keys(profile).length === 0) {
                // If there was no fetch error, but profile is empty
                if (!error) {
                     return (
                         <Paper sx={{ p: 3, textAlign: 'center' }}>
                             <Typography sx={{ mb: 2 }}>Your job profile is empty.</Typography>
                             <Button variant="contained" onClick={handleEditToggle} startIcon={<EditIcon />}>
                                 Create Profile
                             </Button>
                         </Paper>
                     );
                } else {
                    // Error state already handled above if profile is empty
                    return null;
                }
            }
             // Display profile - show fetch error above if it exists but profile data is stale/present
             return (
                 <>
                    {error && <Alert severity="warning" sx={{ mb: 2 }}>Could not refresh profile: {error}</Alert>}
                     <ProfileDisplay profile={profile} currentProfile={currentProfile?? undefined} />
                 </>
            );
        }
    };

    return (
        <Box sx={{ my: 3 }}>
            <Stack direction="row" justifyContent="end" alignItems="center" mb={2}>
                {/* Show Edit button only if NOT loading, NOT editing, and profile has data */}
                {!isLoading && !isEditing && profile && Object.keys(profile).length > 0 && (
                    <Button onClick={handleEditToggle} startIcon={<EditIcon fontSize='small' />}>
                        Edit Profile
                    </Button>
                )}
                 {/* Show Cancel button only when editing */}
                 {isEditing && (
                     <Button onClick={handleEditToggle} color="secondary">
                         Cancel
                     </Button>
                 )}
            </Stack>
            {renderContent()}
        </Box>
    );
};

export default ProfileView;

