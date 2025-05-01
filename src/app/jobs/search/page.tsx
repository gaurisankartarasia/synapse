// // src/app/jobs/search/page.tsx
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from '@mui/material';

// interface Job {
//     id: string;
//     title: string;
//     description: string;
//     company: string;
//     companyLogoUrl:string;
// }

// export default function JobSearchPage() {
//     const [query, setQuery] = useState('');
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleSearch = async () => {
//         if (!query.trim()) return;
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await fetch(`/api/v1/jobs/search?query=${encodeURIComponent(query)}`);
//             if (!response.ok) throw new Error('Failed to fetch jobs');
//             const data = await response.json();
//             setJobs(data.jobs);
//         } catch (err) {
//             setError((err as Error).message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Job Search</h1>
//             <div className="mb-4 flex">
//                 <input
//                     type="text"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Search for jobs..."
//                     className="border p-2 rounded w-full"
//                 />
//                 <Button onClick={handleSearch}
//                 variant='contained'
//                 >
//                     Search
//                 </Button>
//             </div>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">{error}</p>}
//             <ul>
//                 {jobs.map(job => (
//                     <li key={job.id} className="border p-4 rounded-lg mb-2">
//                 <Link href={`/jobs/${job.id}`}>

//                 <Image src={job.companyLogoUrl} alt='logo' width={60} height={60} />
//                         <h2 className="text-lg font-bold">{job.title}</h2>
//                         <p className="text-gray-700">{job.description}</p>
//                         <p className="text-sm text-gray-500">{job.company}</p>
// </Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// src/app/jobs/search/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  TextField, // Use MUI TextField for consistency
  Card,
  CardActionArea,
  Typography,
  Box, // MUI's Box for layout flexibility
  CircularProgress, // For loading indicator
  Alert, // For displaying errors
  Stack, // For layout, especially the list
  Container, // MUI Container for consistent padding/margins
} from "@mui/material";
import { Search } from "@mui/icons-material";

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  companyLogoUrl: string; // Ensure this URL is valid or handle potential errors
}

// A simple placeholder image URL if companyLogoUrl is missing
const FALLBACK_LOGO_URL = "/images/placeholder-logo.png"; // Adjust path as needed

export default function JobSearchPage() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setJobs([]); // Clear previous results

    try {
      // Ensure the API route exists and works as expected
      const response = await fetch(
        `/api/v1/jobs/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            message: "Failed to fetch jobs. Server responded unexpectedly.",
          }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      // Ensure the API returns data in the expected format { jobs: Job[] }
      setJobs(data.jobs || []);
      if (!data.jobs || data.jobs.length === 0) {
        setError("No jobs found matching your query.");
      }
    } catch (err) {
      console.error("Search error:", err); // Log the full error for debugging
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Allow searching by pressing Enter key in the input field
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {" "}
      {/* Use MUI Container */}
      <Box sx={{ display: "flex", mb: 4, gap: 1 }}>
        {" "}
        {/* Use Box for layout */}
        <TextField
          fullWidth // Take remaining width
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress} // Add Enter key search
          placeholder="Search for jobs (e.g., 'React Developer', 'Google')"
          label="Job Title, Keywords, or Company" // Add a label
        />
        <Button
          onClick={handleSearch}
          variant="outlined"
          disabled={loading || !query.trim()} // Disable button when loading or query is empty
          sx={{ whiteSpace: "nowrap" }} // Prevent button text wrapping
        >
          <Search fontSize="small" /> <Typography>Search</Typography>
        </Button>
      </Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && jobs.length > 0 && (
        <Stack spacing={2}>
          {" "}
          {/* Use Stack for vertical spacing */}
          {jobs.map((job) => (
            <Card key={job.id} variant="outlined">
              {/*
                              CardActionArea acts as the link wrapper.
                              We pass the `Link` component from Next.js to the `component` prop.
                              The `href` prop is also passed to CardActionArea, which NextLink will use.
                            */}
              <CardActionArea
                component={Link}
                href={`/jobs/${job.id}`}
                sx={{
                  display: "flex",
                  p: 2,
                  alignItems: "flex-start",
                  textDecoration: "none",
                  color: "inherit",
                }} // Ensure link styles don't override content
              >
                {/* Logo Section */}
                <Box sx={{ mr: 2, flexShrink: 0 }}>
                  <Image
                    // Use fallback if logo URL is missing
                    src={job.companyLogoUrl || FALLBACK_LOGO_URL}
                    alt={`${job.company} logo`}
                    width={60}
                    height={60}
                    style={{ borderRadius: "4px", objectFit: "contain" }} // Add objectFit
                    // Handle potential image loading errors
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LOGO_URL;
                    }}
                  />
                </Box>

                {/* Content Section */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {job.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ mb: 0.5 }}
                  >
                    {job.company}
                  </Typography>
                  {/* Optional: Truncate long descriptions */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2, // Limit to 2 lines
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      mb: 1,
                    }}
                  >
                    {job.description}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
