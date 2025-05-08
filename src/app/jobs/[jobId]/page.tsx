

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
    params: Promise<{ jobId: string }>; 
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


