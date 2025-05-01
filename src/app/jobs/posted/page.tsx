// src/app/my-jobs/page.tsx
'use client'; // Required for useState and useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Image from 'next/image';

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
                // In the previous step we created '/api/user/my-jobs'
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

    // Define the navigation function - Added missing closing brace
    const goToDetails = (jobId: string) => {
        router.push(`/jobs/${jobId}`);
    }; // <-- Added missing closing brace here

    return (
        <div className="container mx-auto p-4"> {/* Basic styling */}
            <h1 className="text-2xl font-bold mb-4">My Posted Jobs</h1>

            {loading && <p>Loading your jobs...</p>}

            {error && <p className="text-red-500">Error fetching jobs: {error}</p>}

            {!loading && !error && (
                <>
                    {jobs.length === 0 ? (
                        <p>You haven't posted any jobs yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="border cursor-pointer rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                    // Apply onClick directly here and call goToDetails with job.id
                                    onClick={() => goToDetails(job.id)}
                                >
                                    {/* Removed the extra inner div */}
                                    <div className="flex items-start space-x-4">
                                        {job.companyLogoUrl && (
                                            <Image
                                                src={job.companyLogoUrl}
                                                width={25}
                                                height={25}
                                                alt={`${job.company} logo`}
                                                className="object-contain rounded border"
                                            />
                                        )}
                                        <div className="flex-grow">
                                            <h2 className="text-xl font-semibold">{job.title}</h2>
                                            <p className="text-md font-medium text-gray-700">{job.company} - {job.location}</p>
                                            <p className="text-sm text-gray-500">
                                                Posted: {new Date(job.postedDate).toLocaleDateString()}
                                                {job.deadline && ` | Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                             <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                 {job.jobType}
                                            </span>
                                            <p className="text-lg font-semibold">{job.salary}</p>
                                        </div>
                                     </div>

                                    {/* Truncate long descriptions or add a 'read more' */}
                                    <p className="mt-3 text-gray-600 line-clamp-3"> {/* Example using tailwind line-clamp */}
                                        {job.description}
                                    </p>
                                    {job.requirements && job.requirements.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="font-semibold text-sm">Requirements:</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-500">
                                                {job.requirements.slice(0, 3).map((req, index) => ( // Show first 3 requirements
                                                    <li key={index}>{req}</li>
                                                ))}
                                                {job.requirements.length > 3 && <li>...</li>}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}