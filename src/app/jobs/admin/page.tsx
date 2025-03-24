'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface JobForm {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string; // Comma-separated string
    deadline: Date;
}

const AdminJobsPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<JobForm>();

    const onSubmit = async (data: JobForm) => {
        // 1. Process requirements string into an array
        const requirementsArray = data.requirements.split(',').map(item => item.trim());

        // 2. Prepare the data to send to the API
        const jobData = {
            ...data,
            requirements: requirementsArray,
            postedDate: new Date().toISOString(),
            // creatorId will be added on the server
        };

        // 3. Call the API endpoint to save the job
        try {
            const response = await fetch('/api/v1/admin/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                alert('Job posted successfully!');
                // Reset the form or redirect
            } else {
                const error = await response.json();
                alert('Error posting job: ' + error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <div>
            <h1>Post a New Job</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Label>Title</Label>
                    <Input {...register("title", { required: "Title is required" })} />
                    {errors.title && <span>{errors.title.message}</span>}
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea {...register("description", { required: "Description is required" })} />
                    {errors.description && <span>{errors.description.message}</span>}
                </div>
                <div>
                    <Label>Company</Label>
                    <Input {...register("company", { required: "Company is required" })} />
                    {errors.company && <span>{errors.company.message}</span>}
                </div>
                <div>
                    <Label>Location</Label>
                    <Input {...register("location", { required: "Location is required" })} />
                    {errors.location && <span>{errors.location.message}</span>}
                </div>
                <div>
                    <Label>Salary</Label>
                    <Input {...register("salary", { required: "Salary is required" })} />
                    {errors.salary && <span>{errors.salary.message}</span>}
                </div>
                <div>
                    <Label>Job Type</Label>
                    <Input {...register("jobType", { required: "Job Type is required" })} />
                    {errors.jobType && <span>{errors.jobType.message}</span>}
                </div>
                <div>
                    <Label>Requirements (comma-separated)</Label>
                    <Input {...register("requirements", { required: "Requirements are required" })} />
                    {errors.requirements && <span>{errors.requirements.message}</span>}
                </div>
                <div>
                    <Label>Deadline</Label>
                    <Input type="date" {...register("deadline")} />
                </div>
                <Button type="submit">Post Job</Button>
            </form>
        </div>
    );
};

export default AdminJobsPage;