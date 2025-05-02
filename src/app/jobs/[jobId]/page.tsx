

//src/app/jobs/[jobId]/page.tsx

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { JobApiResponse } from '@/types/Job/job';
import JobDetailsHeader from '@/components/Jobs/JobDetailsHeader';
import JobDetailItem from '@/components/Jobs/JobDetailItem';
import JobDescription from '@/components/Jobs/JobDescription';
import JobRequirements from '@/components/Jobs/JobRequirements';
import ApplyButton from '@/components/Jobs/ApplyButton';
import { Container, Grid, Typography, CircularProgress, Alert, Paper } from '@mui/material';

// Define props type
interface JobDetailsPageProps {
    params: Promise<{ jobId: string }>; // Updated to handle Promise
}

// Function to fetch job details from the API route
async function getJobDetails(jobId: string): Promise<JobApiResponse | null> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/v1/jobs/${jobId}`;
    console.log("Fetching job details from:", url);

    const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const cookieHeader = cookies().toString();
    if (cookieHeader) {
        requestHeaders['Cookie'] = cookieHeader;
    }

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: requestHeaders,
            cache: 'no-store',
        });

        if (res.status === 404) {
            console.log(`Job ${jobId} not found (404).`);
            return null;
        }

        if (!res.ok) {
            let errorText = `API responded with status ${res.status}`;
            try {
                const errorBody = await res.json();
                errorText = errorBody.message || errorBody.error || errorText;
            } catch (e) {
                errorText = res.statusText || errorText;
            }
            console.error(`API Error fetching job ${jobId} (${res.status}): ${errorText}`);
            throw new Error(`Failed to fetch job details: ${errorText}`);
        }

        const data: JobApiResponse = await res.json();
        return data;

    } catch (error) {
        console.error(`Error fetching or processing job ${jobId}:`, error);
        if (error instanceof Error) {
            throw new Error(`Network or server error: ${error.message}`);
        } else {
            throw new Error('An unknown network or server error occurred.');
        }
    }
}

// Helper to format dates safely
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        if (isNaN(Date.parse(dateString))) {
            return 'Invalid Date';
        }
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    } catch {
        return 'Invalid Date';
    }
};

// The Page Component (Server Component)
export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
    // Await the params Promise
    const { jobId } = await params;

    // Basic validation
    if (!jobId) {
        console.error("Job ID is missing in params.");
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Alert severity="error">Job ID is missing. Cannot load details.</Alert>
            </Container>
        );
    }

    let job: JobApiResponse | null = null;
    let fetchError: string | null = null;

    // Fetch job details
    try {
        job = await getJobDetails(jobId);
    } catch (error) {
        console.error("Error occurred in Page while fetching job:", error);
        fetchError = error instanceof Error ? error.message : "An unknown error occurred while fetching job details.";
    }

    // Handle job not found
    if (!job && !fetchError) {
        notFound();
    }

    // Handle fetch errors
    if (fetchError) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error Loading Job Details
                </Alert>
                <Typography color="text.secondary">{fetchError}</Typography>
            </Container>
        );
    }

    // Render job details
    if (job) {
        return (
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 7, boxShadow: 'none' }}>
                    <JobDetailsHeader job={job} />

                    <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <JobDetailItem label="Salary" value={job.salary || 'Not Specified'} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <JobDetailItem label="Job Type" value={job.jobType || 'Not Specified'} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <JobDetailItem label="Posted On" value={formatDate(job.postedDate)} />
                        </Grid>
                        {job.deadline && (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <JobDetailItem label="Apply By" value={formatDate(job.deadline)} />
                            </Grid>
                        )}
                    </Grid>

                    <JobDescription description={job.description} />
                    <JobRequirements requirements={job.requirements} />
                    <ApplyButton job={job} />
                </Paper>
            </Container>
        );
    }

    // Fallback loading state
    return (
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading job details...</Typography>
        </Container>
    );
}



// // src/app/jobs/[jobId]/page.tsx

// import { notFound } from 'next/navigation';
// // Removed 'cookies' import as it's not needed here anymore for the fetch header
// import { JobApiResponse } from '@/types/Job/job';
// import JobDetailsHeader from '@/components/Jobs/JobDetailsHeader';
// import JobDetailItem from '@/components/Jobs/JobDetailItem';
// import JobDescription from '@/components/Jobs/JobDescription';
// import JobRequirements from '@/components/Jobs/JobRequirements';
// import ApplyButton from '@/components/Jobs/ApplyButton';
// import { Container, Grid, Typography, CircularProgress, Alert, Paper } from '@mui/material';

// // Define props type - corrected params type
// interface JobDetailsPageProps {
//     params: { jobId: string }; // No Promise needed here
// }

// // Function to fetch job details from the API route
// async function getJobDetails(jobId: string): Promise<JobApiResponse | null> {
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//     const url = `${baseUrl}/api/v1/jobs/${jobId}`;
//     console.log("Fetching job details from:", url);

//     // Headers for the request - Content-Type is usually sufficient
//     const requestHeaders: HeadersInit = {
//         'Content-Type': 'application/json',
//         // Removed manual Cookie header setting.
//         // Next.js fetch automatically forwards cookies for same-origin requests from Server Components.
//     };

//     try {
//         // Fetch automatically handles cookies when calling internal API routes
//         const res = await fetch(url, {
//             method: 'GET',
//             headers: requestHeaders,
//             cache: 'no-store', // Keep dynamic fetching
//         });

//         if (res.status === 404) {
//             console.log(`Job ${jobId} not found (404).`);
//             return null; // Signal not found
//         }

//         if (!res.ok) {
//             let errorText = `API responded with status ${res.status}`;
//             try {
//                 const errorBody = await res.json();
//                 // Use more specific error message if available from API response
//                 errorText = errorBody.message || errorBody.error || errorText;
//             } catch (e) {
//                 // Fallback if response isn't JSON or doesn't have expected fields
//                 errorText = res.statusText || errorText;
//             }
//             console.error(`API Error fetching job ${jobId} (${res.status}): ${errorText}`);
//             // Throw an error that reflects the API issue
//             throw new Error(`Failed to fetch job details: ${errorText}`);
//         }

//         const data: JobApiResponse = await res.json();
//         return data;

//     } catch (error) {
//         console.error(`Error fetching or processing job ${jobId}:`, error);
//         // Re-throw specific errors for better handling upstream
//         if (error instanceof Error) {
//             // Add context to the error message
//             throw new Error(`Network or server error while fetching job ${jobId}: ${error.message}`);
//         } else {
//             // Generic fallback
//             throw new Error(`An unknown network or server error occurred while fetching job ${jobId}.`);
//         }
//     }
// }

// // Helper to format dates safely
// const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return 'N/A';
//     try {
//         const date = new Date(dateString);
//         // Check if the date is valid after parsing
//         if (isNaN(date.getTime())) {
//             return 'Invalid Date';
//         }
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric', month: 'long', day: 'numeric',
//         });
//     } catch (e) {
//         console.error("Error formatting date:", dateString, e);
//         return 'Invalid Date';
//     }
// };

// // The Page Component (Server Component)
// export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
//     // Directly access jobId from params - no await needed
//     const { jobId } = params;

//     // Basic validation
//     if (!jobId) {
//         console.error("Job ID is missing in params.");
//         return (
//             <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//                 <Alert severity="error">Job ID is missing. Cannot load details.</Alert>
//             </Container>
//         );
//     }

//     let job: JobApiResponse | null = null;
//     let fetchError: string | null = null;

//     // Fetch job details
//     try {
//         console.log(`JobDetailsPage: Attempting to fetch details for jobId: ${jobId}`);
//         job = await getJobDetails(jobId);
//         console.log(`JobDetailsPage: Fetched details result for ${jobId}:`, job ? 'Success' : 'Not Found or Error');
//     } catch (error) {
//         console.error("JobDetailsPage: Error occurred while fetching job:", error);
//         fetchError = error instanceof Error ? error.message : "An unknown error occurred while fetching job details.";
//     }

//     // Handle job not found (getJobDetails returned null)
//     if (!job && !fetchError) {
//         console.log(`JobDetailsPage: Job ${jobId} not found, triggering 404.`);
//         notFound(); // Use Next.js notFound helper
//     }

//     // Handle fetch errors explicitly caught
//     if (fetchError) {
//         return (
//             <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                     Error Loading Job Details
//                 </Alert>
//                 <Typography color="text.secondary">{fetchError}</Typography>
//                 {/* Optionally provide more user-friendly message */}
//                 {/* <Typography color="text.secondary">Could not load job details. Please try again later.</Typography> */}
//             </Container>
//         );
//     }

//     // Render job details if job exists and there was no error
//     if (job) {
//         return (
//             <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
//                 <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' /* Example: softer radius */, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' /* Example: subtle shadow */ }}>
//                     <JobDetailsHeader job={job} />

//                     {/* Corrected MUI Grid syntax */}
//                     <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 }, mt: 3 /* Add some top margin */ }}>
//                         <Grid item xs={12} sm={6} md={3}> {/* Use item prop and breakpoint props */}
//                             <JobDetailItem label="Salary" value={job.salary || 'Not Specified'} />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={3}>
//                             <JobDetailItem label="Job Type" value={job.jobType || 'Not Specified'} />
//                         </Grid>
//                         <Grid item xs={12} sm={6} md={3}>
//                             <JobDetailItem label="Posted On" value={formatDate(job.postedDate)} />
//                         </Grid>
//                         {job.deadline && (
//                             <Grid item xs={12} sm={6} md={3}>
//                                 <JobDetailItem label="Apply By" value={formatDate(job.deadline)} />
//                             </Grid>
//                         )}
//                     </Grid>

//                     <JobDescription description={job.description} />
//                     <JobRequirements requirements={job.requirements} />
//                     <ApplyButton job={job} />
//                 </Paper>
//             </Container>
//         );
//     }

//     // Fallback loading state (should ideally not be reached if errors/not found are handled)
//     return (
//         <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//             <CircularProgress />
//             <Typography sx={{ mt: 2 }}>Loading job details...</Typography>
//         </Container>
//     );
// }