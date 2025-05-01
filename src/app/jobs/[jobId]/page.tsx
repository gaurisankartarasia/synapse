

// import { notFound } from 'next/navigation';
// import { JobApiResponse } from '@/types/Job/job';
// import JobDetailsHeader from '@/components/Jobs/JobDetailsHeader';
// import JobDetailItem from '@/components/Jobs/JobDetailItem';
// import JobDescription from '@/components/Jobs/JobDescription';
// import JobRequirements from '@/components/Jobs/JobRequirements';
// import ApplyButton from '@/components/Jobs/ApplyButton';
// import { Container, Grid, Typography } from '@mui/material';

// // Define props type
// interface JobDetailsPageProps {
//     params: {
//         jobId: string;
//     };
//     searchParams?: { [key: string]: string | string[] | undefined };
// }

// async function getJobDetails(jobId: string): Promise<JobApiResponse | null> {
//     const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/v1/jobs/${jobId}`;
//     console.log("Fetching job details from:", url);

//     const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             // 'Cookie': require('next/headers').cookies().toString(),
//         },
//     });

//     if (res.status === 404) {
//         console.log(`Job ${jobId} not found (404).`);
//         return null;
//     }

//     if (!res.ok) {
//         const errorText = await res.text();
//         console.error(`API Error fetching job ${jobId} (${res.status}): ${errorText}`);
//         throw new Error(`Failed to fetch job details. Status: ${res.status}`);
//     }

//     try {
//         const data: JobApiResponse = await res.json();
//         return data;
//     } catch (e) {
//         console.error(`Error parsing JSON for job ${jobId}:`, e);
//         throw new Error(`Failed to parse job details response.`);
//     }
// }

// const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return 'N/A';
//     try {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric', month: 'long', day: 'numeric',
//         });
//     } catch {
//         return 'Invalid Date';
//     }
// };

// export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
//     const { jobId } =  params;

//     if (!jobId) {
//         alert("jobid not found")
//     }

//     let job: JobApiResponse | null = null;
//     let fetchError: string | null = null;

//     try {
//         job = await getJobDetails(jobId);
//     } catch (error) {
//         console.error("Error in Page fetching job:", error);
//         fetchError = error instanceof Error ? error.message : "An unknown error occurred while fetching job details.";
//     }

//     if (!job && !fetchError) {
//         notFound();
//     }

//     if (fetchError) {
//         return (
//             <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//                 <Typography variant="h6" color="error" mb={2}>Error Loading Job</Typography>
//                 <Typography color="text.secondary">{fetchError}</Typography>
//             </Container>
//         );
//     }

//     if (job) {
//         return (
//             <Container maxWidth="md" sx={{ py: 8 }}>
//                 <JobDetailsHeader job={job} />

//                 <Grid container spacing={6} mb={6}>
//                     <Grid size={{xs:12, md:4}} >
//                         <JobDetailItem label="Salary" value={job.salary} />
//                     </Grid>
//                     <Grid size={{xs:12, md:4}}>
//                         <JobDetailItem label="Job Type" value={job.jobType} />
//                     </Grid>
//                     <Grid size={{xs:12, md:4}}>
//                         <JobDetailItem label="Posted On" value={formatDate(job.postedDate)} />
//                     </Grid>
//                     {job.deadline && (
//                         <Grid size={{xs:12, md:4}}>
//                             <JobDetailItem label="Apply By" value={formatDate(job.deadline)} />
//                         </Grid>
//                     )}
//                 </Grid>

//                 <JobDescription description={job.description} />
//                 <JobRequirements requirements={job.requirements} />
//                 <ApplyButton job={job} />
//             </Container>
//         );
//     }

//     return (
//         <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//             <Typography>Loading job details or job not found.</Typography>
//         </Container>
//     );
// }




// import { notFound } from 'next/navigation';
// import { cookies } from 'next/headers'; // Import cookies if needed for passing auth
// import { JobApiResponse } from '@/types/Job/job';
// import JobDetailsHeader from '@/components/Jobs/JobDetailsHeader';
// import JobDetailItem from '@/components/Jobs/JobDetailItem';
// import JobDescription from '@/components/Jobs/JobDescription';
// import JobRequirements from '@/components/Jobs/JobRequirements';
// import ApplyButton from '@/components/Jobs/ApplyButton';
// import { Container, Grid, Typography, CircularProgress, Alert, Paper } from '@mui/material'; // Added CircularProgress, Alert

// // Define props type
// interface JobDetailsPageProps {
//     params: {
//         jobId: string;
//     };
//     // searchParams are optional and automatically passed if needed
//     // searchParams?: { [key: string]: string | string[] | undefined };
// }

// // Function to fetch job details from the API route
// async function getJobDetails(jobId: string): Promise<JobApiResponse | null> {
//     // Ensure NEXT_PUBLIC_BASE_URL is set, otherwise fallback to localhost for development
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//     const url = `${baseUrl}/api/v1/jobs/${jobId}`;
//     console.log("Fetching job details from:", url);

//     // Prepare headers, potentially including cookies for authentication
//     const requestHeaders: HeadersInit = {
//         'Content-Type': 'application/json',
//     };
//     // Pass cookies from the incoming request to the API route if needed for auth
//     const cookieHeader = cookies().toString();
//     if (cookieHeader) {
//         requestHeaders['Cookie'] = cookieHeader;
//     }

//     try {
//         const res = await fetch(url, {
//             method: 'GET',
//             headers: requestHeaders,
//             cache: 'no-store', // Ensure fresh data, adjust as needed (e.g., 'force-cache', 'default')
//         });

//         if (res.status === 404) {
//             console.log(`Job ${jobId} not found (404).`);
//             return null; // Trigger notFound() in the component
//         }

//         if (!res.ok) {
//             // Try to get more specific error message from API response
//             let errorText = `API responded with status ${res.status}`;
//             try {
//                 const errorBody = await res.json();
//                 errorText = errorBody.message || errorBody.error || errorText;
//             } catch (e) {
//                 // If response is not JSON or empty, use the status text
//                 errorText = res.statusText || errorText;
//             }
//             console.error(`API Error fetching job ${jobId} (${res.status}): ${errorText}`);
//             // Throw an error with a more informative message
//             throw new Error(`Failed to fetch job details: ${errorText}`);
//         }

//         // Attempt to parse the JSON response
//         const data: JobApiResponse = await res.json();
//         return data;

//     } catch (error) {
//         // Handle fetch errors (network issues, DNS errors, etc.) or errors thrown above
//         console.error(`Error fetching or processing job ${jobId}:`, error);
//         // Re-throw the error to be caught by the page component's try-catch
//         if (error instanceof Error) {
//             throw new Error(`Network or server error: ${error.message}`);
//         } else {
//             throw new Error('An unknown network or server error occurred.');
//         }
//     }
// }

// // Helper to format dates safely
// const formatDate = (dateString: string | null | undefined): string => {
//     if (!dateString) return 'N/A';
//     try {
//         // Check if the dateString is a valid date representation before parsing
//         if (isNaN(Date.parse(dateString))) {
//             return 'Invalid Date';
//         }
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric', month: 'long', day: 'numeric',
//         });
//     } catch {
//         return 'Invalid Date';
//     }
// };

// // The Page Component (Server Component)
// export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
//     // Access jobId from params passed by Next.js router
//     const { jobId } = params;

//     // Basic validation, though Next.js routing typically ensures jobId exists
//     if (!jobId) {
//         // This case is unlikely if routing is set up correctly, but good practice
//         console.error("Job ID is missing in params.");
//         // Render an error state or redirect
//         return (
//             <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//                 <Alert severity="error">Job ID is missing. Cannot load details.</Alert>
//             </Container>
//         );
//     }

//     let job: JobApiResponse | null = null;
//     let fetchError: string | null = null;

//     // Fetch job details within a try-catch block
//     try {
//         job = await getJobDetails(jobId);
//     } catch (error) {
//         console.error("Error occurred in Page while fetching job:", error);
//         fetchError = error instanceof Error ? error.message : "An unknown error occurred while fetching job details.";
//     }

//     // Handle job not found (404 from API)
//     if (!job && !fetchError) {
//         notFound(); // Use Next.js notFound() helper to render the 404 page
//     }

//     // Handle fetch errors (500 from API, network errors, etc.)
//     if (fetchError) {
//         return (
//             <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                     Error Loading Job Details
//                 </Alert>
//                 <Typography color="text.secondary">{fetchError}</Typography>
//             </Container>
//         );
//     }

//     // Render job details if successfully fetched
//     if (job) {
//         return (
//             <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}> 
//                 <Paper  elevation={3} sx={{ p: 4, borderRadius: 7, boxShadow:'none' }}>
//                 <JobDetailsHeader job={job} />

//                 {/* Grid for Job Detail Items */}
//                 <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
//                     {/* Correct MUI Grid item usage */}
//                     <Grid size={{xs:12, sm:6, md:3}} > {/* Adjust responsiveness */}
//                         <JobDetailItem label="Salary" value={job.salary || 'Not Specified'} />
//                     </Grid>
//                     <Grid size={{xs:12, sm:6, md:3}}>
//                         <JobDetailItem label="Job Type" value={job.jobType || 'Not Specified'} />
//                     </Grid>
//                     <Grid size={{xs:12, sm:6, md:3}}>
//                         <JobDetailItem label="Posted On" value={formatDate(job.postedDate)} />
//                     </Grid>
//                     {job.deadline && (
//                         <Grid size={{xs:12, sm:6, md:3}}>
//                             <JobDetailItem label="Apply By" value={formatDate(job.deadline)} />
//                         </Grid>
//                     )}
//                 </Grid>

//                 {/* Use JobDescription component */}
//                 <JobDescription description={job.description} />

//                 {/* Use JobRequirements component */}
//                 <JobRequirements requirements={job.requirements} />

//                 <ApplyButton job={job} />
//                 </Paper>
//             </Container>
//         );
//     }

//     // Fallback/Loading state (optional, as Server Components often render fully or show errors)
//     // You might implement Suspense boundaries for a better loading experience
//     return (
//         <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
//             <CircularProgress />
//             <Typography sx={{ mt: 2 }}>Loading job details...</Typography>
//         </Container>
//     );
// }










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
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
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