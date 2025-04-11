
'use client';

import React from 'react';
import { useForm } from 'react-hook-form'; // Controller might be needed for complex MUI inputs, though TextField often works directly

// MUI Imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface JobForm {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string; // Comma-separated string
    deadline: string; // Keep as string for TextField type="date" compatibility initially
}

const AdminJobsPage: React.FC = () => {
    // Default values can help with controlled components and date input placeholders
    const { register, handleSubmit, formState: { errors }, reset } = useForm<JobForm>({
        defaultValues: {
            title: '',
            description: '',
            company: '',
            location: '',
            salary: '',
            jobType: '',
            requirements: '',
            deadline: '', // Default to empty string or format today's date if needed
        }
    });

    const onSubmit = async (data: JobForm) => {
        // 1. Process requirements string into an array
        const requirementsArray = data.requirements.split(',').map(item => item.trim()).filter(item => item); // Filter empty strings

        // 2. Prepare the data to send to the API
        const jobData = {
            ...data,
            deadline: data.deadline ? new Date(data.deadline).toISOString() : null, // Convert date string to ISO or handle empty
            requirements: requirementsArray,
            postedDate: new Date().toISOString(),
            // creatorId will be added on the server
        };

        console.log("Submitting data:", jobData); // For debugging

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
                reset(); // Reset the form fields on success
            } else {
                const error = await response.json();
                console.error('API Error:', error);
                alert('Error posting job: ' + (error.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <Container maxWidth="md"> {/* Adjust maxWidth as needed */}
            <Box sx={{ my: 4 }}> {/* Add some vertical margin */}
                <Typography variant="h4" component="h1" gutterBottom>
                    Post a New Job
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={3}> {/* Add spacing between form elements */}
                        <TextField
                            label="Title"
                            variant="outlined" // Standard MUI style
                            fullWidth
                            {...register("title", { required: "Title is required" })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4} // Adjust number of rows
                            {...register("description", { required: "Description is required" })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                        <TextField
                            label="Company"
                            variant="outlined"
                            fullWidth
                            {...register("company", { required: "Company is required" })}
                            error={!!errors.company}
                            helperText={errors.company?.message}
                        />
                        <TextField
                            label="Location"
                            variant="outlined"
                            fullWidth
                            {...register("location", { required: "Location is required" })}
                            error={!!errors.location}
                            helperText={errors.location?.message}
                        />
                        <TextField
                            label="Salary"
                            variant="outlined"
                            fullWidth
                            {...register("salary", { required: "Salary is required" })}
                            error={!!errors.salary}
                            helperText={errors.salary?.message}
                        />
                        <TextField
                            label="Job Type"
                            variant="outlined"
                            fullWidth
                            {...register("jobType", { required: "Job Type is required" })}
                            error={!!errors.jobType}
                            helperText={errors.jobType?.message}
                        />
                        <TextField
                            label="Requirements (comma-separated)"
                            variant="outlined"
                            fullWidth
                            {...register("requirements", { required: "Requirements are required" })}
                            error={!!errors.requirements}
                            helperText={errors.requirements?.message}
                        />
                        <TextField
                            label="Application Deadline"
                            type="date"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                                shrink: true, // Ensures label doesn't overlap date input
                            }}
                            {...register("deadline")} // Make deadline optional or add validation
                            error={!!errors.deadline}
                            helperText={errors.deadline?.message || 'Optional: Leave blank if no deadline'}
                        />
                        <Button
                            type="submit"
                            variant="contained" // Filled button style
                            color="primary" // Use theme's primary color
                            size="large"
                            sx={{ mt: 2 }} 
                           
                        >
                            Post Job
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default AdminJobsPage;