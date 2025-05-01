
// src/components/profile/ProfileView.tsx
"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    Button,
    CircularProgress,
    Alert,
    Typography,
    Paper, // Keep Paper import
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
// Import the base type and the specific API payload type
// Make sure the path @/types/Job/JobProfile is correct
import { JobProfile } from '@/types/Job/JobProfile';
// Import the type expected by the onSubmit prop of ProfileForm
import { JobProfileApiPayload } from '@/components/Jobs/profile/ProfileForm'; // Adjust path if needed, usually types are separate
import ProfileDisplay from '@/components/Jobs/profile/ProfileDisplay';

import { useProfile } from "@/hooks/useProfile";

// Dynamically import the form for code splitting
const DynamicProfileForm = dynamic(() => import('@/components/Jobs/profile/ProfileForm'), {
    loading: () => <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>,
    ssr: false, // Form is interactive, no need to SSR
});

const ProfileView = () => {
    const [profile, setProfile] = useState<JobProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

      const { profile: currentProfile } = useProfile();

    // --- Data Fetching ---
    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Ensure this API endpoint is correct
            const response = await fetch('/api/user-profile/job');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch profile (${response.status})`);
            }
            const data = await response.json();
            setProfile(data.profile || {});
        } catch (err: any) {
            console.error("Fetch error:", err);
            setError(err.message || 'An unexpected error occurred while fetching the profile.');
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // --- Data Submission ---
    // ***** FIX: Change the parameter type here *****
    const handleSaveProfile = async (apiPayload: JobProfileApiPayload) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Ensure this API endpoint is correct
            const response = await fetch('/api/user-profile/job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the apiPayload received from the form directly
                body: JSON.stringify(apiPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to save profile (${response.status})`);
            }

            const result = await response.json();
            // Ensure result.profile matches the JobProfile structure
            setProfile(result.profile as JobProfile);
            setIsEditing(false);

        } catch (err: any) {
            console.error("Save error:", err);
            setError(err.message || 'An unexpected error occurred while saving the profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Toggle Edit Mode ---
    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
        setError(null);
    }

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoading) {
            return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
        }

        if (error && !isEditing) {
            return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
        }

        if (isEditing) {
            return (
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <DynamicProfileForm
                        initialData={profile}
                        // Pass the correctly typed handleSaveProfile function
                        onSubmit={handleSaveProfile}
                        onCancel={handleEditToggle}
                        isSubmitting={isSubmitting}
                    />
                </Suspense>
            )
        } else {
            if (!profile || Object.keys(profile).length === 0) {
                return (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography sx={{ mb: 2 }}>Your job profile is empty.</Typography>
                        <Button variant="contained" onClick={handleEditToggle} startIcon={<EditIcon />}>
                            Create Profile
                        </Button>
                    </Paper>
                )
            }
            return <ProfileDisplay profile={profile} currentProfile={currentProfile?? undefined}     />;
        }
    }

    return (
        <Box sx={{ my: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h1">
                     Job Profile
                </Typography>
                {!isLoading && !isEditing && profile && Object.keys(profile).length > 0 && (
                    <Button variant="outlined" onClick={handleEditToggle} startIcon={<EditIcon />}>
                        Edit Profile
                    </Button>
                )}
            </Stack>
            {renderContent()}
        </Box>
    );
};

export default ProfileView;