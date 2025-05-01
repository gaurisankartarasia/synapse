// src/app/saved-jobs/page.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// We removed direct db, verifyJWT imports from here as requested (verifyJWT could be kept for initial check if desired)
// Import the data type definition from the API route file

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link'; // Use MUI Link for consistency
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Example Icon
import NextLink from 'next/link'; // Use NextLink for client-side navigation
import { formatDistanceToNow } from 'date-fns'; // For user-friendly dates

// Define a type for the full job details (adjust based on your actual Job schema)
interface JobDetails {
    id: string;
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    // Add other relevant fields from your 'jobs' collection
    postedAt?: string | Date; // Example
    applyUrl?: string; // Example
}

// Combined type for display - This is what the API will return
 interface SavedJobDisplayData extends JobDetails {
    savedAt: string; // ISO String
}


// Helper function to fetch data from the API route within the Server Component
// It needs access to cookies for authentication propagation
async function fetchSavedJobsFromApi(cookieHeader: string | undefined): Promise<SavedJobDisplayData[]> {
    // Construct the absolute URL for fetch within server components
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/jobs/saved`; // Ensure you have NEXT_PUBLIC_APP_URL in your .env

    const headers: HeadersInit = {};
    if (cookieHeader) {
        headers['Cookie'] = cookieHeader; // Forward the cookie to the API route
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
            cache: 'no-store', // Ensure fresh data is fetched, disable caching for this request
        });

        if (response.status === 401) {
             // Re-throw specific error for auth failure to be caught by page
             throw new Error('Unauthorized');
        }

        if (!response.ok) {
            // Attempt to parse error message from API
            let errorBody = null;
            try {
                 errorBody = await response.json();
            } catch (e) { /* Ignore parsing error */ }

            throw new Error(errorBody?.error || `API request failed with status ${response.status}`);
        }

        const data: SavedJobDisplayData[] = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching saved jobs from API:', error);
        // Re-throw the error to be handled by the page
        throw error;
    }
}


// --- The Main Page Component (Server Component) ---
export default async function SavedJobsPage() {
    let savedJobs: SavedJobDisplayData[] = [];
    let fetchError: string | null = null;

    // Get cookies server-side
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const cookieHeader = cookieStore.toString(); // Prepare cookie string for fetch header

    // Perform initial authentication check on the page itself
    if (!token?.value) {
        // Optional: verify token integrity here too using verifyJWT if needed before fetching
        redirect('/login'); // Redirect if no token found
    }

    // Try fetching data from the API endpoint
    try {
         // Pass the raw cookie header string to the fetch helper
        savedJobs = await fetchSavedJobsFromApi(cookieHeader);
    } catch (error: any) {
        console.error("Error on SavedJobsPage (fetching from API):", error);
         if (error.message === 'Unauthorized') {
            // Handle unauthorized error specifically (e.g., token expired/invalid)
            redirect('/login'); // Redirect to login if API returns 401
         }
         // Store other errors to display a message
         fetchError = error.message || "An unexpected error occurred while loading saved jobs.";
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" component="h1" gutterBottom>
                Saved Jobs
            </Typography>

            {fetchError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {fetchError}
                </Alert>
            )}

            {!fetchError && savedJobs.length === 0 && (
                 <Alert severity="info" sx={{ mt: 3 }}>
                    You haven't saved any jobs yet.
                </Alert>
            )}

            {!fetchError && savedJobs.length > 0 && (
                <Grid container spacing={3}>
                    {savedJobs.map((job) => (
                        <Grid size={{xs:12, sm:6, md:4}}  key={job.id}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {job.title || 'No Title'}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {job.company || 'No Company'} - {job.location || 'No Location'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }} noWrap>
                                        {job.description ? `${job.description.substring(0, 100)}...` : 'No description available.'}
                                    </Typography>
                                     <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                        <BookmarkIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                        <Typography variant="caption">
                                             Saved {formatDistanceToNow(new Date(job.savedAt), { addSuffix: true })}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ mt: 'auto' }}>
                                    <Button
                                        size="small"
                                        component={NextLink} // Use NextLink for client routing
                                        href={`/jobs/${job.id}`} // Adjust path to your job detail page
                                    >
                                        View Details
                                    </Button>
                                    {/* Optional: Unsave button */}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
             <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
                {/* Suspense boundary if needed */}
             </Suspense>
        </Container>
    );
}

// Optional: Add metadata
export const metadata = {
  title: 'Saved Jobs',
  description: 'View your saved job applications.',
};