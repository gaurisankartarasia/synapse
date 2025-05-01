// src/app/profile/page.tsx
import React from 'react';
import { Container } from '@mui/material';
import ProfileView from '@/components/Jobs/profile/ProfileView'; // Import the client component

// This page itself can remain a Server Component
export default function ProfilePage() {

  // You could potentially fetch non-sensitive layout data here if needed
  // but the core profile logic is handled by the client component ProfileView

  return (
    <Container maxWidth="lg">
       {/*
         Wrap ProfileView in Suspense if you want a page-level fallback
         during the initial load of the ProfileView component itself,
         although ProfileView handles its internal loading state.
       */}
       {/* <Suspense fallback={<p>Loading profile page...</p>}> */}
            <ProfileView />
       {/* </Suspense> */}
    </Container>
  );
}

