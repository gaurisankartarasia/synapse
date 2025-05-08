// // src/app/my-jobs/page.tsx
// 'use client'; // Required for useState and useEffect

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; 
// import Image from 'next/image';

// // Define the Job interface matching the API response
// interface Job {
//     id: string;
//     title: string;
//     description: string;
//     company: string;
//     location: string;
//     salary: string;
//     jobType: string;
//     requirements: string[];
//     postedDate: string; // Expect ISO string
//     deadline: string | null; // Expect ISO string or null
//     creatorId: string;
//     companyLogoUrl?: string;
// }


// export default function MyJobsPage() {
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     const router = useRouter(); // Initialize router

//     useEffect(() => {
//         const fetchMyJobs = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 // Make sure this API endpoint '/api/v1/jobs/posted' is correct
//                 // In the previous step we created '/api/v1/user/my-jobs'
//                 // Using the one provided in your code here:
//                 const response = await fetch('/api/v1/jobs/posted');

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 setJobs(data.jobs || []); // Ensure jobs is always an array

//             } catch (err) {
//                 console.error("Failed to fetch jobs:", err);
//                 setError(err instanceof Error ? err.message : 'An unknown error occurred');
//                 setJobs([]); // Clear jobs on error
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMyJobs();
//     }, []); // Empty dependency array ensures this runs only once on mount

//     // Define the navigation function - Added missing closing brace
//     const goToDetails = (jobId: string) => {
//         router.push(`/jobs/${jobId}`);
//     }; // <-- Added missing closing brace here

//     return (
//         <div className="container mx-auto p-4"> {/* Basic styling */}
//             <h1 className="text-2xl font-bold mb-4">My Posted Jobs</h1>

//             {loading && <p>Loading your jobs...</p>}

//             {error && <p className="text-red-500">Error fetching jobs: {error}</p>}

//             {!loading && !error && (
//                 <>
//                     {jobs.length === 0 ? (
//                         <p>You haven't posted any jobs yet.</p>
//                     ) : (
//                         <div className="space-y-6">
//                             {jobs.map((job) => (
//                                 <div
//                                     key={job.id}
//                                     className="border cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
//                                     // Apply onClick directly here and call goToDetails with job.id
//                                     onClick={() => goToDetails(job.id)}
//                                 >
//                                     {/* Removed the extra inner div */}
//                                     <div className="flex items-start space-x-4">
//                                         {job.companyLogoUrl && (
//                                             <Image
//                                                 src={job.companyLogoUrl}
//                                                 width={25}
//                                                 height={25}
//                                                 alt={`${job.company} logo`}
//                                                 className="object-contain rounded border"
//                                             />
//                                         )}
//                                         <div className="flex-grow">
//                                             <h2 className="text-xl font-semibold">{job.title}</h2>
//                                             <p className="text-md font-medium text-gray-700">{job.company} - {job.location}</p>
//                                             <p className="text-sm text-gray-500">
//                                                 Posted: {new Date(job.postedDate).toLocaleDateString()}
//                                                 {job.deadline && ` | Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
//                                             </p>
//                                         </div>
//                                         <div className="text-right">
//                                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
//                                                  {job.jobType}
//                                             </span>
//                                             <p className="text-lg font-semibold">{job.salary}</p>
//                                         </div>
//                                      </div>

//                                     {/* Truncate long descriptions or add a 'read more' */}
//                                     <p className="mt-3 text-gray-600 line-clamp-3"> {/* Example using tailwind line-clamp */}
//                                         {job.description}
//                                     </p>
//                                     {job.requirements && job.requirements.length > 0 && (
//                                         <div className="mt-3">
//                                             <h4 className="font-semibold text-sm">Requirements:</h4>
//                                             <ul className="list-disc list-inside text-sm text-gray-500">
//                                                 {job.requirements.slice(0, 3).map((req, index) => ( // Show first 3 requirements
//                                                     <li key={index}>{req}</li>
//                                                 ))}
//                                                 {job.requirements.length > 3 && <li>...</li>}
//                                             </ul>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }




// src/app/my-jobs/page.tsx
'use client'; // Required for useState and useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Define the Job interface matching the API response
interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  requirements: string[];
  postedDate: string; // Expect ISO string
  deadline: string | null; // Expect ISO string or null
  creatorId: string;
  companyLogoUrl?: string;
  appliedAt?: string;
  closesAt?: string;
  status?: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected'; // Add status if available
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchMyJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Make sure this API endpoint '/api/v1/jobs/posted' is correct
        // In the previous step we created '/api/v1/user/my-jobs'
        // Using the one provided in your code here:
        const response = await fetch('/api/v1/jobs/posted');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data.jobs || []); // Ensure jobs is always an array
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setJobs([]); // Clear jobs on error
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []); // Empty dependency array ensures this runs only once on mount

  const goToDetails = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return `about ${interval} year${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `about ${interval} month${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `about ${interval} day${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `about ${interval} hour${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `about ${interval} minute${interval === 1 ? '' : 's'} ago`;
    }
    return `about ${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  };

  return (
    <div style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        Track and manage all your job applications in one place
      </Typography>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[0, 1, 2, 3].map((index) => (
            <Card key={index}>
              <CardContent>
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" width={40} height={40} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rectangular" width={80} height={30} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {jobs.length === 0 ? (
            <Typography variant="subtitle1">You haven't posted any jobs yet.</Typography>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} 
             
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      {job.companyLogoUrl && (
                        <Image
                          src={job.companyLogoUrl}
                          alt={`${job.company} logo`}
                          width={40}
                          height={40}
                          style={{ borderRadius: 4, border: '1px solid #ccc', objectFit: 'contain' }}
                        />
                      )}
                      <div>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {job.company}
                        </Typography>
                      </div>
                      {job.status && (
                        <Chip label={job.status} color={job.status === 'Pending' ? 'warning' : job.status === 'Shortlisted' ? 'success' : job.status === 'Rejected' ? 'error' : 'info'} size="small" />
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AttachMoneyIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {job.salary}
                      </Typography>
                    </Stack>
                    {job.appliedAt && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTimeIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          Applied {formatTimeAgo(job.appliedAt)}
                        </Typography>
                      </Stack>
                    )}
                    {job.closesAt && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarTodayIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                          Closes {formatDate(job.closesAt)}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
               

                </CardContent> 
                  <CardActions>

                    <Button LinkComponent={Link} href={`/jobs/${job.id}/applicants`}>Applicants</Button>
                    <Button LinkComponent={Link} href={`/jobs/${job.id}/edit`}>Edit</Button>
                    <Button LinkComponent={Link} href={`/jobs/${job.id}`}>Details</Button>
                  </CardActions>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}