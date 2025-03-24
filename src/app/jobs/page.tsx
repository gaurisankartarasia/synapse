

// // src/app/jobs/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchJobs } from '@/redux/features/jobSlice';
// import { RootState } from '@/redux/store';
// import { formatDistanceToNow, parseISO } from 'date-fns';
// import { useForm } from 'react-hook-form';
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { FileInput } from "@/components/ui/file-input";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { AppDispatch } from '@/redux/store';
// import Link from 'next/link';

// interface JobForm {
//     fullName: string;
//     email: string;
//     phone: string;
//     resume: FileList;
//     coverLetter: string;
//     portfolio: string;
// }

// const JobsPage: React.FC = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { jobs, loading, error } = useSelector((state: RootState) => state.job);
//     const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const { register, handleSubmit, formState: { errors }, reset } = useForm<JobForm>();

//     useEffect(() => {
//         dispatch(fetchJobs());
//     }, [dispatch]);

//     const handleApplyClick = (jobId: string | undefined) => {
//         if (jobId) {
//             setSelectedJobId(jobId);
//             setIsDialogOpen(true);
//         }
//     };

//     const onSubmit = async (data: JobForm) => {
//         if (!selectedJobId) {
//             alert('No job selected.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('fullName', data.fullName);
//         formData.append('email', data.email);
//         if (data.phone) {
//             formData.append('phone', data.phone);
//         }
//         formData.append('resume', data.resume[0]);
//         if (data.coverLetter) {
//             formData.append('coverLetter', data.coverLetter);
//         }
//         if (data.portfolio) {
//             formData.append('portfolio', data.portfolio);
//         }
//         formData.append('jobId', selectedJobId);

//         try {
//             const response = await fetch('/api/v1/jobs/apply', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (response.ok) {
//                 alert('Application submitted successfully!');
//                 setIsDialogOpen(false);
//                 reset(); // Reset form after successful submission
//             } else {
//                 const errorData = await response.json();
//                 alert('Error submitting application: ' + (errorData.message || 'Unknown error'));
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('An unexpected error occurred.');
//         }
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center h-64">Loading...</div>;
//     }

//     if (error) {
//         return <div className="text-red-500 p-4">Error: {error}</div>;
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <Link href="/jobs/admin" className='text-blue-500 hover:underline mr-7' >Post a job</Link>
//             <Link href="/jobs/applied" className='text-blue-500 hover:underline ' >Applied jobs</Link>
//             <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {jobs && jobs.length > 0 ? jobs.map(job => (
//                     <Card key={job.id} className="h-full flex flex-col">
//                         <CardHeader>
//                             <CardTitle>{job.title}</CardTitle>
//                             <CardDescription>
//                                 {job.company} - {job.location}
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex-grow">
//                             <p className="mb-4">{job.description}</p>
//                             <div className="space-y-2">
//                                 <p>
//                                     <strong>Job Type:</strong> {job.jobType}
//                                 </p>
//                                 <p>
//                                     <strong>Salary:</strong> {job.salary}
//                                 </p>
//                                 <p>
//                                     <strong>Requirements:</strong> {Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements}
//                                 </p>
//                                 <p>
//                                     <strong>Posted:</strong>{" "}
//                                     {job.postedDate && typeof job.postedDate === 'string' ? 
//                                         formatDistanceToNow(parseISO(job.postedDate), { addSuffix: true })
//                                         : 'Date unavailable'}
//                                 </p>
//                             </div>
//                         </CardContent>
//                         <div className="p-4 pt-0 mt-auto">
//                             <Button 
//                                 className="w-full" 
//                                 onClick={() => handleApplyClick(job.id)}
//                             >
//                                 Apply Now
//                             </Button>
//                         </div>
//                     </Card>
//                 )) : (
//                     <div className="col-span-full text-center py-8">No job listings available.</div>
//                 )}
//             </div>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent className="sm:max-w-[500px]">
//                     <DialogHeader>
//                         <DialogTitle>
//                             Apply for {selectedJobId && jobs ? 
//                                 jobs.find(job => job.id === selectedJobId)?.title 
//                                 : 'Job'}
//                         </DialogTitle>
//                         <DialogDescription>
//                             Enter your details to apply for this job.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="fullName">Full Name</Label>
//                             <Input 
//                                 id="fullName"
//                                 {...register("fullName", { required: "Full Name is required" })} 
//                             />
//                             {errors.fullName && (
//                                 <p className="text-sm text-red-500">{errors.fullName.message}</p>
//                             )}
//                         </div>
                        
//                         <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input 
//                                 id="email"
//                                 type="email" 
//                                 {...register("email", { 
//                                     required: "Email is required",
//                                     pattern: {
//                                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                         message: "Invalid email address"
//                                     }
//                                 })} 
//                             />
//                             {errors.email && (
//                                 <p className="text-sm text-red-500">{errors.email.message}</p>
//                             )}
//                         </div>
                        
//                         <div className="space-y-2">
//                             <Label htmlFor="phone">Phone Number (Optional)</Label>
//                             <Input 
//                                 id="phone"
//                                 type="tel" 
//                                 {...register("phone")} 
//                             />
//                         </div>
                        
//                         <div className="space-y-2">
//                             <Label htmlFor="resume">Resume/CV</Label>
//                             <FileInput 
//                                 id="resume"
//                                 accept=".pdf,.doc,.docx"
//                                 {...register("resume", { required: "Resume is required" })} 
//                             />
//                             {errors.resume && (
//                                 <p className="text-sm text-red-500">{errors.resume.message}</p>
//                             )}
//                         </div>
                        
//                         <div className="space-y-2">
//                             <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
//                             <Textarea 
//                                 id="coverLetter"
//                                 {...register("coverLetter")} 
//                             />
//                         </div>
                        
//                         <div className="space-y-2">
//                             <Label htmlFor="portfolio">Portfolio/Website Link (Optional)</Label>
//                             <Input 
//                                 id="portfolio"
//                                 {...register("portfolio")} 
//                             />
//                         </div>
                        
//                         <div className="flex justify-end gap-2 pt-4">
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//                                 Cancel
//                             </Button>
//                             <Button type="submit">
//                                 Submit Application
//                             </Button>
//                         </div>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default JobsPage;









// src/app/jobs/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/features/jobSlice';
import { RootState } from '@/redux/store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription>
                                    {job.company} - {job.location}
                                </CardDescription>
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