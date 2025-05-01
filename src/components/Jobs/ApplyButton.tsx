"use client";
import React from "react";
import { Button, Box } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { JobApiResponse } from "@/types/Job/job";

interface JobDetailsHeaderProps {
  job: NonNullable<JobApiResponse>;
}

const ApplyButton: React.FC<JobDetailsHeaderProps> = ({ job }) => {
  const { user } = useAuth();
  const jobId = job.id;

  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
      {user ? (
        <>
        <div className="flex items-center gap-2">
          <Button
            LinkComponent={Link}
            href={`/jobs/apply/${jobId}`}
            variant="outlined"
          >
            Apply with new form
          </Button>
          <Button
            LinkComponent={Link}
            href={`/jobs/apply/${jobId}`}
            variant="contained"
          >
            Easy apply with job profile
          </Button></div>
        </>
      ) : (
        "Sign in to apply for this job"
      )}
    </Box>
  );
};

export default ApplyButton;
