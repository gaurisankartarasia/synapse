
// src/app/jobs/page.tsx
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "@/redux/features/jobSlice"; 
import { Job } from "@/types/Job/job"; 
import { RootState, AppDispatch } from "@/redux/store";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import Link from "next/link";
import JobProfileCard from "@/components/Jobs/profile/card/card";

import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Grid
} from "@mui/material";
import {
  WorkOutline as WorkOutlineIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon, // Placeholder icon
} from "@mui/icons-material";

// --- Helper Function for Date Formatting ---
const formatPostedDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "Date unavailable";
  }
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return "Invalid date";
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Date format error";
  }
};

// --- Reusable Job Card Component ---
interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const jobId = job.id

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column",  '&&:hover': { 
                      boxShadow: 1,
                    } }}>
      <CardActionArea LinkComponent={Link} href={`/jobs/${jobId}`}>
        <CardHeader
          avatar={
            <Avatar
              src={job.companyLogoUrl || undefined} // Use undefined if null/empty
              alt={job.company || "Company Logo"}
              variant="rounded" // Or 'circular'
              sx={{
                bgcolor: job.companyLogoUrl
                  ? "transparent"
                  : "action.disabledBackground",
              }} // Background if no logo
            >
              {!job.companyLogoUrl && <BusinessIcon />}
            </Avatar>
          }
          title={
            <Typography variant="h6" component="div" noWrap title={job.title}>
              {job.title || "N/A"}
            </Typography>
          }
          subheader={
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              title={`${job.company} - ${job.location}`}
            >
              {job.company || "N/A"} - {job.location || "N/A"}
            </Typography>
          }
          sx={{ pb: 1 }} // Reduce bottom padding
        />
        <CardContent sx={{ flexGrow: 1, pt: 0 }}>
          {" "}
          {/* Takes available space */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
            {job.jobType && (
              <Chip
                icon={<WorkOutlineIcon fontSize="small" />}
                label={job.jobType}
                size="small"
                variant="outlined"
              />
            )}
            {job.salary && (
              <Chip
                icon={<AttachMoneyIcon fontSize="small" />}
                label={job.salary}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <AccessTimeIcon fontSize="inherit" /> Posted:{" "}
            {formatPostedDate(job.postedDate)}
          </Typography>
          <Typography color="text.secondary" sx={{fontSize:'0.8rem'}} >Posted by {job.creator.username}   </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// --- Reusable Job List Item Component ---
interface JobListItemProps {
  job: Job;
}

const JobListItem: React.FC<JobListItemProps> = ({ job }) => {

  return (
    <ListItem
      alignItems="flex-start"
   
      sx={{ py: 2 }} // Padding top/bottom
    >
      <ListItemAvatar>
        <Avatar
          src={job.companyLogoUrl || undefined}
          alt={job.company || "Company Logo"}
          variant="rounded"
          sx={{
            bgcolor: job.companyLogoUrl
              ? "transparent"
              : "action.disabledBackground",
          }}
        >
          {!job.companyLogoUrl && <BusinessIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body1" component="div" fontWeight="medium">
            {job.title || "N/A"}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "block" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {job.company || "N/A"} - {job.location || "N/A"}
            </Typography>
            <Typography color="text.secondary" sx={{fontSize:'0.8rem'}} >Posted by {job.creator.username}   </Typography>

            <Typography
              sx={{ display: "block", mt: 0.5 }}
              component="span"
              variant="caption"
              color="text.secondary"
            >
              Posted: {formatPostedDate(job.postedDate)}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

// --- Main Page Component ---
const JobsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.job);
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const jobsInCards = jobs.slice(0, 6);
  // Limit list items to 10 (indices 6 to 15)
  const jobsInList = jobs.slice(6, 16);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        {" "}
        {/* Adjust min-h as needed */}
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading jobs: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
     

      <Typography
        variant="h6"
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{ mb: 4 }}
      >
        Available Job Listings
      </Typography>

      {jobs && jobs.length > 0 ? (
        <>
          {/* Card Layout Section (First 6 Jobs) */}
          {jobsInCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobsInCards.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* List Layout Section (Next 10 Jobs) */}
          {jobsInList.length > 0 && (
            <>
            
              <Typography variant="h5" component="h2" sx={{ mt: 6, mb: 2 }}>
                More Opportunities
              </Typography>
              <Grid container spacing={2} >
                <Grid size={9}  >
              <Card variant="outlined">
                <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
                  {jobsInList.map((job, index) => (
                    <React.Fragment key={job.id}>
                      <CardActionArea
                        LinkComponent={Link} href={`/jobs/${job.id}`}
                      >  <JobListItem job={job} />
                    
                        </CardActionArea>{" "}
                      {index < jobsInList.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Card></Grid>
              <Grid size={3}  >
                 <JobProfileCard/>
              </Grid>
             
              </Grid>
            </>
          )}
        </>
      ) : (
        <div className="col-span-full text-center py-12">
          <Typography variant="h6" color="text.secondary">
            No job listings available at the moment.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
