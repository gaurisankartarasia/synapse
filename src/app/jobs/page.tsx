
// src/app/jobs/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/features/jobSlice';
import { RootState } from '@/redux/store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button, Card, CardHeader, CardContent } from '@mui/material';

const JobsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { jobs, loading, error } = useSelector((state: RootState) => state.job);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Link href="/jobs/admin" className="text-blue-500 hover:underline mr-7">Post a job</Link>
            <Link href="/jobs/applied" className="text-blue-500 hover:underline mr-7">Applied jobs</Link>
            <Link href="/jobs/search" className="text-blue-500 hover:underline">Search jobs</Link>
            <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs && jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Card key={job.id} className="h-full flex flex-col">
                            <CardHeader>
                                <h4>{job.title}</h4>
                                <p>
                                    {job.company} - {job.location}
                                </p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="mb-4">{job.description}</p>
                                <div className="space-y-2">
                                    <p><strong>Job Type:</strong> {job.jobType}</p>
                                    <p><strong>Salary:</strong> {job.salary}</p>
                                    <p>
                                        <strong>Requirements:</strong>{' '}
                                        {Array.isArray(job.requirements)
                                            ? job.requirements.join(', ')
                                            : job.requirements}
                                    </p>
                                    <p>
                                        <strong>Posted:</strong>{' '}
                                        {job.postedDate && typeof job.postedDate === 'string'
                                            ? formatDistanceToNow(parseISO(job.postedDate), { addSuffix: true })
                                            : 'Date unavailable'}
                                    </p>
                                </div>
                            </CardContent>
                            <div className="p-4 pt-0 mt-auto">
                                <Button
                                    className="w-full"
                                    onClick={() => router.push(`/jobs/apply/${job.id}`)}
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">No job listings available.</div>
                )}
            </div>
        </div>
    );
};

export default JobsPage;




