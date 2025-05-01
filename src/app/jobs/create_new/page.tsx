
// 'use client';

// import React from 'react';
// import { useForm } from 'react-hook-form'; // Controller might be needed for complex MUI inputs, though TextField often works directly

// // MUI Imports
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';

// interface JobForm {
//     title: string;
//     description: string;
//     company: string;
//     location: string;
//     salary: string;
//     jobType: string;
//     requirements: string; // Comma-separated string
//     deadline: string; // Keep as string for TextField type="date" compatibility initially
// }

// const AdminJobsPage: React.FC = () => {
//     // Default values can help with controlled components and date input placeholders
//     const { register, handleSubmit, formState: { errors }, reset } = useForm<JobForm>({
//         defaultValues: {
//             title: '',
//             description: '',
//             company: '',
//             location: '',
//             salary: '',
//             jobType: '',
//             requirements: '',
//             deadline: '', // Default to empty string or format today's date if needed
//         }
//     });

//     const onSubmit = async (data: JobForm) => {
//         // 1. Process requirements string into an array
//         const requirementsArray = data.requirements.split(',').map(item => item.trim()).filter(item => item); // Filter empty strings

//         // 2. Prepare the data to send to the API
//         const jobData = {
//             ...data,
//             deadline: data.deadline ? new Date(data.deadline).toISOString() : null, // Convert date string to ISO or handle empty
//             requirements: requirementsArray,
//             postedDate: new Date().toISOString(),
//             // creatorId will be added on the server
//         };

//         console.log("Submitting data:", jobData); // For debugging

//         // 3. Call the API endpoint to save the job
//         try {
//             const response = await fetch('/api/v1/admin/jobs', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(jobData),
//             });

//             if (response.ok) {
//                 alert('Job posted successfully!');
//                 reset(); // Reset the form fields on success
//             } else {
//                 const error = await response.json();
//                 console.error('API Error:', error);
//                 alert('Error posting job: ' + (error.message || 'Unknown error'));
//             }
//         } catch (error) {
//             console.error('Fetch Error:', error);
//             alert('An unexpected error occurred.');
//         }
//     };

//     return (
//         <Container maxWidth="md"> {/* Adjust maxWidth as needed */}
//             <Box sx={{ my: 4 }}> {/* Add some vertical margin */}
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Post a New Job
//                 </Typography>
//                 <form onSubmit={handleSubmit(onSubmit)} noValidate>
//                     <Stack spacing={3}> {/* Add spacing between form elements */}
//                         <TextField
//                             label="Title"
//                             variant="outlined" // Standard MUI style
//                             fullWidth
//                             {...register("title", { required: "Title is required" })}
//                             error={!!errors.title}
//                             helperText={errors.title?.message}
//                         />
//                         <TextField
//                             label="Description"
//                             variant="outlined"
//                             fullWidth
//                             multiline
//                             rows={4} // Adjust number of rows
//                             {...register("description", { required: "Description is required" })}
//                             error={!!errors.description}
//                             helperText={errors.description?.message}
//                         />
//                         <TextField
//                             label="Company"
//                             variant="outlined"
//                             fullWidth
//                             {...register("company", { required: "Company is required" })}
//                             error={!!errors.company}
//                             helperText={errors.company?.message}
//                         />
//                         <TextField
//                             label="Location"
//                             variant="outlined"
//                             fullWidth
//                             {...register("location", { required: "Location is required" })}
//                             error={!!errors.location}
//                             helperText={errors.location?.message}
//                         />
//                         <TextField
//                             label="Salary"
//                             variant="outlined"
//                             fullWidth
//                             {...register("salary", { required: "Salary is required" })}
//                             error={!!errors.salary}
//                             helperText={errors.salary?.message}
//                         />
//                         <TextField
//                             label="Job Type"
//                             variant="outlined"
//                             fullWidth
//                             {...register("jobType", { required: "Job Type is required" })}
//                             error={!!errors.jobType}
//                             helperText={errors.jobType?.message}
//                         />
//                         <TextField
//                             label="Requirements (comma-separated)"
//                             variant="outlined"
//                             fullWidth
//                             {...register("requirements", { required: "Requirements are required" })}
//                             error={!!errors.requirements}
//                             helperText={errors.requirements?.message}
//                         />
//                         <TextField
//                             label="Application Deadline"
//                             type="date"
//                             variant="outlined"
//                             fullWidth
//                             InputLabelProps={{
//                                 shrink: true, // Ensures label doesn't overlap date input
//                             }}
//                             {...register("deadline")} // Make deadline optional or add validation
//                             error={!!errors.deadline}
//                             helperText={errors.deadline?.message || 'Optional: Leave blank if no deadline'}
//                         />
//                         <Button
//                             type="submit"
//                             variant="contained" // Filled button style
//                             color="primary" // Use theme's primary color
//                             size="large"
//                             sx={{ mt: 2 }} 
                           
//                         >
//                             Post Job
//                         </Button>
//                     </Stack>
//                 </form>
//             </Box>
//         </Container>
//     );
// };

// export default AdminJobsPage;







'use client';

 import React, { useState } from 'react'; // Import useState
 import { useForm } from 'react-hook-form';

 // MUI Imports
 import Container from '@mui/material/Container';
 import Box from '@mui/material/Box';
 import TextField from '@mui/material/TextField';
 import Button from '@mui/material/Button';
 import Typography from '@mui/material/Typography';
 import Stack from '@mui/material/Stack';
 import Avatar from '@mui/material/Avatar'; // For logo preview
 import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Optional icon

 interface JobForm {
     title: string;
     description: string;
     company: string;
     location: string;
     salary: string;
     jobType: string;
     requirements: string; // Comma-separated string
     deadline: string;
     companyLogo?: FileList; // Add companyLogo field for the file input
 }

 const AdminJobsPage: React.FC = () => {
     const [logoPreview, setLogoPreview] = useState<string | null>(null); // State for preview URL
     const [isSubmitting, setIsSubmitting] = useState(false); // State for loading indicator

     const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<JobForm>({
         defaultValues: {
             title: '',
             description: '',
             company: '',
             location: '',
             salary: '',
             jobType: '',
             requirements: '',
             deadline: '',
             companyLogo: undefined,
         }
     });

     // Watch the companyLogo field to update the preview
     const watchedLogo = watch('companyLogo');
     React.useEffect(() => {
         if (watchedLogo && watchedLogo.length > 0) {
             const file = watchedLogo[0];
             const previewUrl = URL.createObjectURL(file);
             setLogoPreview(previewUrl);

             // Clean up the object URL when component unmounts or file changes
             return () => URL.revokeObjectURL(previewUrl);
         } else {
             setLogoPreview(null); // Clear preview if no file selected
         }
     }, [watchedLogo]);


     const onSubmit = async (data: JobForm) => {
         setIsSubmitting(true); // Start loading indicator

         // Use FormData to handle file upload
         const formData = new FormData();

         // Append all text fields
         formData.append('title', data.title);
         formData.append('description', data.description);
         formData.append('company', data.company);
         formData.append('location', data.location);
         formData.append('salary', data.salary);
         formData.append('jobType', data.jobType);
         formData.append('requirements', data.requirements); // Send as string, parse on backend
         formData.append('deadline', data.deadline); // Send as string, parse on backend

         // Append the file if selected
         if (data.companyLogo && data.companyLogo.length > 0) {
             formData.append('companyLogoFile', data.companyLogo[0]); // Use a specific key for the file
         }

         console.log("Submitting FormData..."); // For debugging

         try {
             const response = await fetch('/api/v1/admin/jobs', {
                 method: 'POST',
                 // Don't set Content-Type header when using FormData with fetch,
                 // the browser will set it correctly including the boundary
                 body: formData,
             });

             if (response.ok) {
                 alert('Job posted successfully!');
                 reset(); // Reset the form fields on success
                 setLogoPreview(null); // Clear the logo preview
             } else {
                 const error = await response.json();
                 console.error('API Error:', error);
                 alert('Error posting job: ' + (error.message || 'Unknown error'));
             }
         } catch (error) {
             console.error('Fetch Error:', error);
             alert('An unexpected error occurred.');
         } finally {
            setIsSubmitting(false); // Stop loading indicator
         }
     };

     return (
         <Container maxWidth="md">
             <Box sx={{ my: 4 }}>
                 <Typography variant="h4" component="h1" gutterBottom>
                     Post a New Job
                 </Typography>
                 <form onSubmit={handleSubmit(onSubmit)} noValidate>
                     <Stack spacing={3}>
                         {/* ... (keep existing TextField components for title, description, etc.) ... */}

                         <TextField
                             label="Title"
                             variant="outlined"
                             fullWidth
                             {...register("title", { required: "Title is required" })}
                             error={!!errors.title}
                             helperText={errors.title?.message}
                             disabled={isSubmitting}
                         />
                          <TextField
                             label="Description"
                             variant="outlined"
                             fullWidth
                             multiline
                             rows={4}
                             {...register("description", { required: "Description is required" })}
                             error={!!errors.description}
                             helperText={errors.description?.message}
                             disabled={isSubmitting}
                         />
                         <TextField
                             label="Company"
                             variant="outlined"
                             fullWidth
                             {...register("company", { required: "Company is required" })}
                             error={!!errors.company}
                             helperText={errors.company?.message}
                             disabled={isSubmitting}
                         />
                         <TextField
                             label="Location"
                             variant="outlined"
                             fullWidth
                             {...register("location", { required: "Location is required" })}
                             error={!!errors.location}
                             helperText={errors.location?.message}
                             disabled={isSubmitting}
                         />
                         <TextField
                             label="Salary"
                             variant="outlined"
                             fullWidth
                             {...register("salary", { required: "Salary is required" })}
                             error={!!errors.salary}
                             helperText={errors.salary?.message}
                             disabled={isSubmitting}
                         />
                         <TextField
                             label="Job Type"
                             variant="outlined"
                             fullWidth
                             {...register("jobType", { required: "Job Type is required" })}
                             error={!!errors.jobType}
                             helperText={errors.jobType?.message}
                             disabled={isSubmitting}
                         />
                         <TextField
                             label="Requirements (comma-separated)"
                             variant="outlined"
                             fullWidth
                             {...register("requirements", { required: "Requirements are required" })}
                             error={!!errors.requirements}
                             helperText={errors.requirements?.message}
                             disabled={isSubmitting}
                         />
                         <TextField
                             label="Application Deadline"
                             type="date"
                             variant="outlined"
                             fullWidth
                             InputLabelProps={{ shrink: true }}
                             {...register("deadline")}
                             error={!!errors.deadline}
                             helperText={errors.deadline?.message || 'Optional: Leave blank if no deadline'}
                             disabled={isSubmitting}
                         />

                         {/* Company Logo Upload */}
                         <Stack direction="row" spacing={2} alignItems="center">
                             <Button
                                 variant="outlined"
                                 component="label" // Makes the button act as a label for the hidden input
                                 startIcon={<CloudUploadIcon />}
                                 disabled={isSubmitting}
                             >
                                 Upload Company Logo
                                 <input
                                     type="file"
                                     hidden // Hide the default browser input
                                     accept="image/*" // Accept only image files
                                     {...register("companyLogo")}
                                 />
                             </Button>
                             {logoPreview && (
                                 <Avatar
                                     src={logoPreview}
                                     alt="Logo Preview"
                                     sx={{ width: 56, height: 56 }}
                                 />
                             )}
                             {errors.companyLogo && (
                                  <Typography color="error" variant="caption">
                                      {errors.companyLogo.message}
                                  </Typography>
                             )}
                         </Stack>
                         {/* End Company Logo Upload */}

                         <Button
                             type="submit"
                             variant="contained"
                             color="primary"
                             size="large"
                             sx={{ mt: 2 }}
                             disabled={isSubmitting} // Disable button while submitting
                         >
                             {isSubmitting ? 'Posting...' : 'Post Job'}
                         </Button>
                     </Stack>
                 </form>
             </Box>
         </Container>
     );
 };

 export default AdminJobsPage;