import React from "react";
import Image from "next/image";
import Link from "next/link";
import SaveJobButton from "@/components/Jobs/SaveButton";
import { JobApiResponse } from "@/types/Job/job";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";

interface JobDetailsHeaderProps {
  job: NonNullable<JobApiResponse>;
}

const JobDetailsHeader: React.FC<JobDetailsHeaderProps> = ({ job }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 6,
        pb: 4,
        borderBottom: 1,
        borderColor: "divider",
        gap: 4,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        {job.companyLogoUrl && (
          <Box sx={{ mr: 2, flexShrink: 0 }}>
            <Image
              src={job.companyLogoUrl}
              alt={`${job.company} Logo`}
              width={80}
              height={80}
              className="rounded-md object-contain"
            />
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="text.primary"
          >
            {job.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {job.company}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.location}
          </Typography>
         <span className="text-xs"> Posted by </span>  <Typography sx={{fontWeight:'500', '&:hover':{textDecoration:'underline'}}} component={Link} href={`/${job.creator.username}`} color="text.secondary">
          {job.creator.username}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexShrink: 0, mt: 1, display: "flex", alignItems: "center" }}>
        {job.creatorId === job.viewer.uid && (
            <Tooltip title="Edit details" >
          <IconButton  LinkComponent={Link} href={`/jobs/${job.id}/edit`} >
            <Edit />
          </IconButton>
        </Tooltip>
        )}     
           <SaveJobButton jobId={job.id} initialIsSaved={job.isSavedByUser} />

      </Box>
    </Box>
  );
};

export default JobDetailsHeader;
