"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation"; // Use next/navigation for App Router

// MUI Imports
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress"; // Loading indicator
import Alert from "@mui/material/Alert"; // For messages

// Re-use or define the JobForm interface (ensure consistency with backend/POST form)
interface JobForm {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  requirements: string; // Comma-separated string for the form
  deadline: string; // Expecting YYYY-MM-DD string format from API
  companyLogo?: FileList;
  companyLogoUrl?: string; // To store the existing logo URL for preview
}

// Interface for the data received from the GET API
interface JobApiResponse {
  jobData: {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[]; // Array from Firestore
    postedDate: string; // ISO String
    deadline?: string | null; // YYYY-MM-DD string or null
    creatorId: string;
    companyLogoUrl?: string;
  };
  isEditable: boolean;
}

const EditJobPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId as string; // Get jobId from URL params

  const [initialJobData, setInitialJobData] = useState<
    JobApiResponse["jobData"] | null
  >(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<JobForm>({
    defaultValues: {
      // Initialize with empty/default values
      title: "",
      description: "",
      company: "",
      location: "",
      salary: "",
      jobType: "",
      requirements: "",
      deadline: "",
      companyLogo: undefined,
      companyLogoUrl: undefined,
    },
  });

  // Fetch job data on component mount or when jobId changes
  useEffect(() => {
    if (!jobId) {
      setError("Job ID not found in URL.");
      setIsLoading(false);
      return;
    }

    const fetchJobData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/jobs/${jobId}/edit`); // Use the GET endpoint
        const data: JobApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            `Failed to fetch job data (status: ${response.status})`
          );
        }

        setInitialJobData(data.jobData);
        setIsEditable(data.isEditable);

        // Pre-fill the form once data is fetched
        if (data.jobData) {
          reset({
            title: data.jobData.title,
            description: data.jobData.description,
            company: data.jobData.company,
            location: data.jobData.location,
            salary: data.jobData.salary,
            jobType: data.jobData.jobType,
            requirements: data.jobData.requirements.join(", "), // Convert array back to string
            deadline: data.jobData.deadline || "", // Use fetched deadline or empty string
            companyLogoUrl: data.jobData.companyLogoUrl, // Store existing URL
            companyLogo: undefined, // Reset file input
          });
          setLogoPreview(data.jobData.companyLogoUrl || null); // Set initial preview
        }
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(
          err.message || "An error occurred while fetching job details."
        );
        setIsEditable(false); // Can't edit if fetch failed
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobId, reset]); // Dependency array includes jobId and reset

  // Watch the companyLogo field to update the preview
  const watchedLogo = watch("companyLogo");
  useEffect(() => {
    if (watchedLogo && watchedLogo.length > 0) {
      const file = watchedLogo[0];
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      // Clean up the object URL
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      // If file input is cleared, revert preview to the initial logo URL
      setLogoPreview(initialJobData?.companyLogoUrl || null);
    }
  }, [watchedLogo, initialJobData?.companyLogoUrl]); // Re-run if watchedLogo or initial URL changes

  const onSubmit = async (data: JobForm) => {
    if (!jobId || !isEditable) return; // Should not happen if UI is correct, but good check

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();

    // Append all text fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("company", data.company);
    formData.append("location", data.location);
    formData.append("salary", data.salary);
    formData.append("jobType", data.jobType);
    formData.append("requirements", data.requirements);
    formData.append("deadline", data.deadline || ""); // Send empty string if no deadline

    // Append the new file ONLY if selected
    if (data.companyLogo && data.companyLogo.length > 0) {
      formData.append("companyLogoFile", data.companyLogo[0]);
    }
    // Note: We don't need to send companyLogoUrl, the backend handles existing/new logic

    console.log("Submitting FormData for update...");

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}/edit`, {
        // Use the PUT endpoint
        method: "PUT",
        body: formData, // Browser sets Content-Type for FormData
      });

      const result = await response.json();

      if (response.ok) {
        alert("Job updated successfully!");
        // Optionally, update the initial data state and reset form with new data
        // Or redirect the user
        router.push(`/jobs/${jobId}`); 
        // For now, just show alert and reset submitting state
        // You might want to refetch data or update state based on `result` if needed
      } else {
        console.error("API Error:", result);
        throw new Error(
          result.message || `Failed to update job (status: ${response.status})`
        );
      }
    } catch (err: any) {
      console.error("Update Fetch Error:", err);
      setError(err.message || "An unexpected error occurred during update.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", my: 5 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error && !initialJobData) {
    // Show critical errors if data couldn't load
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!isEditable) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="warning">
          You do not have permission to edit this job posting.
        </Alert>
      </Container>
    );
  }

  // If loading is finished, no critical error, and user is editable, show the form
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Job Posting
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}{" "}
        {/* Show non-critical errors (like update failure) */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Re-use the same TextField structure as the AdminJobsPage */}
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
              {...register("description", {
                required: "Description is required",
              })}
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
              {...register("requirements", {
                required: "Requirements are required",
              })}
              error={!!errors.requirements}
              helperText={errors.requirements?.message}
              disabled={isSubmitting}
            />
            <TextField
              label="Application Deadline"
              type="date" // Use date type
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }} // Ensure label doesn't overlap
              {...register("deadline")} // Registering the field
              error={!!errors.deadline}
              helperText={
                errors.deadline?.message ||
                "Optional: Leave blank or clear to remove deadline"
              }
              disabled={isSubmitting}
            />

            {/* Company Logo Upload/Update */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={isSubmitting}
              >
                {logoPreview ? "Change Logo" : "Upload Logo"}
                <input
    type="file"
    hidden
    accept="image/png, image/jpeg, image/gif, image/webp" // Keep specific types or revert to image/* if preferred
    {...register("companyLogo")} // Register handles the state update
    // REMOVE the onChange prop here
/>
              </Button>
              
              {logoPreview && (
                <Avatar
                  src={logoPreview}
                  alt="Logo Preview"
                  sx={{ width: 56, height: 56 }}
                />
              )}
              {/* Optional: Add button to remove logo
                            {logoPreview && (
                                <Button
                                    variant="text"
                                    color="error"
                                    size="small"
                                    onClick={handleRemoveLogo} // Need to implement handleRemoveLogo
                                    disabled={isSubmitting}
                                >
                                    Remove Logo
                                </Button>
                            )} */}

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
              disabled={isSubmitting || isLoading} // Also disable if still loading initial data
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default EditJobPage;
