// // src/app/applied-jobs/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';

// interface Application {
//     id: string;
//     fullName: string;
//     email: string;
//     phone?: string;
//     resumeUrl?: string;
//     coverLetter?: string;
//     portfolio?: string;
//     applicationDate: string;
// }

// export default function AppliedJobsPage() {
//     const [applications, setApplications] = useState<Application[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         async function fetchApplications() {
//             try {
//                 const response = await fetch('/api/v1/jobs/applied');
//                 if (!response.ok) throw new Error('Failed to fetch applications');
//                 const data = await response.json();
//                 setApplications(data);
//             } catch (err) {
//                 setError((err as Error).message);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchApplications();
//     }, []);

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Applied Jobs</h1>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">{error}</p>}
//             <ul>
//                 {applications.map(app => (
//                     <li key={app.id} className="border p-4 rounded-lg mb-2">
//                         <p><strong>Name:</strong> {app.fullName}</p>
//                         <p><strong>Email:</strong> {app.email}</p>
//                         {app.phone && <p><strong>Phone:</strong> {app.phone}</p>}
//                         {app.resumeUrl && <p><a href={app.resumeUrl} target="_blank" className="text-blue-500">View Resume</a></p>}
//                         {app.coverLetter && <p><strong>Cover Letter:</strong> {app.coverLetter}</p>}
//                         {app.portfolio && <p><strong>Portfolio:</strong> <a href={app.portfolio} target="_blank" className="text-blue-500">View</a></p>}
//                         <p><strong>Applied On:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }





'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Chip,
  Divider,
  Pagination,
  Stack,
  Alert,
  Paper,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Interface for job application data
interface AppliedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  postedDate: string;
  deadline: string | null;
  companyLogoUrl: string | null;
  applicationId: string;
  applicationDate: string;
  applicationStatus?: string;
}

// Pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Response interface
interface AppliedJobsResponse {
  jobs: AppliedJob[];
  pagination: Pagination;
}

// Styled components
const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  '&.pending': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  '&.rejected': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  '&.accepted': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },

}));

const JobCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
 
}));

const CompanyLogo = styled(CardMedia)(({ theme }) => ({
  height: 60,
  width: 60,
  borderRadius: '8px',
  backgroundSize: 'contain',
  backgroundColor: '#f5f5f5',
  marginRight: theme.spacing(2),
}));

const JobHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
}));

export default function AppliedJobsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // Fetch applied jobs
  const fetchAppliedJobs = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/jobs/applied?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch applied jobs');
      }
      
      const data: AppliedJobsResponse = await response.json();
      setAppliedJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchAppliedJobs(value, pagination.limit);
  };

  // Initialize fetch
  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  // Format application status
  const getStatusChipClass = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'pending';
    
    if (statusLower.includes('reject')) return 'rejected';
    if (statusLower.includes('accept') || statusLower.includes('hired')) return 'accepted';
    if (statusLower.includes('interview')) return 'interviewing';
    return 'pending';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
       
        <Typography variant="body1" color="text.secondary">
          Track and manage all your job applications in one place
        </Typography>
      </Box>

     
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[0, 1, 2, 3].map((index) => (
            <Card key={index}>
              <CardContent>
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" width={40} height={40} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="rectangular" width={80} height={30} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && appliedJobs.length === 0 && (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: theme.palette.grey[50],
            borderRadius: 2
          }}
        >
          <HourglassEmptyIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Applications Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            You haven't applied for any jobs yet. Browse open positions to start your application process.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => router.push('/jobs')}
          >
            Browse Open Positions
          </Button>
        </Paper>
      )}

      {!loading && !error && appliedJobs.length > 0 && (
        <>
          <Grid container spacing={3}>
            {appliedJobs.map((job) => (
              <Grid size={{xs:4}} key={job.applicationId}>
                <JobCard     sx={{ 
                    '&&:hover': { 
                      boxShadow: 3,
                    }
                  }}>
                    <CardActionArea LinkComponent={Link} href={`/jobs/${job.id}`} >
                  <CardContent>
                    <JobHeader>
                      <CompanyLogo
                        image={job.companyLogoUrl || '/placeholder-company.png'}
                        title={job.company}
                      />
                      <Box>
                        <Typography variant="h6" component="h2" fontWeight="bold">
                          {job.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {job.company}
                        </Typography>
                      </Box>
                    </JobHeader>

                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={1}>
                        <Grid size={{xs:12, sm:8}} >
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <InfoItem>
                              <LocationOnIcon fontSize="small" />
                              <Typography variant="body2">{job.location}</Typography>
                            </InfoItem>
                            <InfoItem>
                              <WorkIcon fontSize="small" />
                              <Typography variant="body2">{job.jobType}</Typography>
                            </InfoItem>
                            <InfoItem>
                              <AttachMoneyIcon fontSize="small" />
                              <Typography variant="body2">{job.salary}</Typography>
                            </InfoItem>
                          </Box>
                        </Grid>
                        <Grid size={{xs:12, sm:4}}  sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                          <StatusChip 
                            label={job.applicationStatus || 'Accepted'} 
                            className={getStatusChipClass(job.applicationStatus)}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Box>
                        <InfoItem>
                          <CalendarTodayIcon fontSize="small" />
                          <Typography variant="body2">
                            Applied {formatDistanceToNow(new Date(job.applicationDate), { addSuffix: true })}
                          </Typography>
                        </InfoItem>
                        {job.deadline && (
                          <InfoItem>
                            <HourglassEmptyIcon fontSize="small" />
                            <Typography variant="body2">
                              Closes {formatDistanceToNow(new Date(job.deadline), { addSuffix: true })}
                            </Typography>
                          </InfoItem>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  </CardActionArea>
                 
                </JobCard>
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={pagination.totalPages} 
                page={pagination.page} 
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}