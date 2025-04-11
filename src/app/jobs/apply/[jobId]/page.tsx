
'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/features/jobSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useForm, Controller } from 'react-hook-form';

import { Button, TextField } from '@mui/material';

import Link from 'next/link';

interface JobForm {
    fullName: string;
    email: string;
    phone?: string;
    resume: FileList;
    coverLetter?: string;
    portfolio?: string;
}

export default function ApplyPage() {
    const params = useParams();
    const jobId = params?.jobId as string;
    const dispatch = useDispatch<AppDispatch>();
    const { jobs, loading } = useSelector((state: RootState) => state.job);
    const job = jobs.find((j) => j.id === jobId);

    const { 
        register, 
        handleSubmit, 
        control,
        formState: { errors }, 
        reset 
    } = useForm<JobForm>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!job && !loading) {
            dispatch(fetchJobs());
        }
    }, [job, loading, dispatch]);

    const onSubmit = async (data: JobForm) => {
        setSubmitError(null);
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        if (data.phone) formData.append('phone', data.phone);
        
        // Ensure file is selected before appending
        if (data.resume && data.resume.length > 0) {
            formData.append('resume', data.resume[0]);
        } else {
            setSubmitError('Resume is required');
            return;
        }

        if (data.coverLetter) formData.append('coverLetter', data.coverLetter);
        if (data.portfolio) formData.append('portfolio', data.portfolio);
        formData.append('jobId', jobId);

        try {
            const response = await fetch('/api/v1/jobs/apply', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setIsSubmitted(true);
                reset();
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.message || 'Error submitting application');
            }
        } catch (error) {
            console.error('Error:', error);
            setSubmitError('An unexpected error occurred');
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (!job) {
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-xl font-semibold">Job not found</h2>
                <Link href="/jobs" className="text-blue-500 hover:underline">Back to Jobs</Link>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="container mx-auto p-4">
                <h2 className="text-xl font-semibold">Application submitted successfully!</h2>
                <Link href="/jobs" className="text-blue-500 hover:underline">Back to Jobs</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 w-full">
            <Link href="/jobs" className="text-blue-500 hover:underline mb-4 inline-block">
                Back to Jobs
            </Link>
            <h1 className="text-2xl font-bold mb-4">
                Apply for {job.title} at {job.company}
            </h1>
            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {submitError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                <div className="space-y-2">
                    <TextField
                    label="Full Name"
                        id="fullName"
                        {...register('fullName', { required: 'Full Name is required' })}
                    />
                    {errors.fullName && (
                        <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <TextField
                    label="Email"
                        id="email"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <TextField 
                    label="Phone Number (Optional)"
                        id="phone" 
                        type="tel" 
                        {...register('phone')} 
                    />
                </div>

                <div className="space-y-2">
                    <p>Resume/CV</p>
                    <Controller
                        name="resume"
                        control={control}
                        rules={{ required: 'Resume is required' }}
                        render={({ field: { onChange, value, ...field } }) => (
                            <input
                                {...field}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    onChange(e.target.files);
                                }}
                            />
                        )}
                    />
                    {errors.resume && (
                        <p className="text-sm text-red-500">{errors.resume.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <TextField
                    label='Cover Letter (Optional)' 
                        id="coverLetter" 
                        {...register('coverLetter')} 
                    />
                </div>

                <div className="space-y-2">
                    <TextField
                    label="Portfolio/Website Link (Optional)" 
                        id="portfolio" 
                        {...register('portfolio')} 
                    />
                </div>

                <Button type="submit">Submit Application</Button>
            </form>
        </div>
    );
}