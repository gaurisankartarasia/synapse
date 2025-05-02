
// "use client";
// import React, { useState, useEffect } from "react";
// import { Button, Box, CircularProgress, Alert, Snackbar } from "@mui/material";
// import { useAuth } from "@/hooks/useAuth";
// import Link from "next/link";
// import { JobApiResponse } from "@/types/Job/job";
// import { useApplyWithProfile } from "@/hooks/job/useApplyWithProfile"; // Import the hook

// interface JobDetailsHeaderProps {
//   job: NonNullable<JobApiResponse>;
// }

// const ApplyButton: React.FC<JobDetailsHeaderProps> = ({ job }) => {
//   const { user } = useAuth();
//   const {
//         apply: applyWithProfile,
//         isLoading,
//         error,
//         isSuccess
//     } = useApplyWithProfile(); // Use the updated hook
//   const jobId = job.id;

//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//   const handleEasyApply = async () => {
//     if (!jobId) return;
//     // Reset success message state before applying again
//     // Error state is reset inside the hook's apply function
//     setShowSuccessMessage(false);
//     await applyWithProfile({ jobId });
//     // Let useEffect handle showing the message based on isSuccess flag
//   };

//   // Use useEffect to show Snackbar when isSuccess becomes true
//   useEffect(() => {
//       if (isSuccess) {
//           setShowSuccessMessage(true);
//       }
//   }, [isSuccess]);

//   const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setShowSuccessMessage(false);
//   };


//   return (
//     <Box sx={{ mt: 8, textAlign: "center" }}>
//       {user ? (
//         <>
//           {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

//           <div className="flex flex-wrap items-center justify-center gap-2"> {/* Added flex-wrap */}
//             <Button
//               LinkComponent={Link}
//               href={`/jobs/apply/${jobId}`} // Link to the separate application form page
//               variant="outlined"
//               disabled={isLoading} // Disable if easy apply is loading
//               sx={{ textTransform: 'none' }} // Optional: prevent uppercase
//             >
//               Apply with New Form
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleEasyApply} // Call hook's function on click
//               disabled={isLoading || (isSuccess && !error)} // Disable while loading or after success (if no error occurred)
//               startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
//               sx={{ textTransform: 'none' }} // Optional: prevent uppercase
//             >
//               {isLoading ? 'Applying...' : (isSuccess && !error ? 'Applied Successfully!' : 'Easy Apply with Job Profile')}
//             </Button>
//           </div>
//         </>
//       ) : (
//         <Box sx={{ typography: 'body1', color: 'text.secondary' }}> {/* Style the sign-in message */}
//              Sign in to apply for this job
//         </Box>
//       )}

//       {/* Snackbar for Success Message */}
//        <Snackbar
//          open={showSuccessMessage}
//          autoHideDuration={6000} // Hide after 6 seconds
//          onClose={handleCloseSnackbar}
//          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//        >
//          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }} variant="filled">
//            Application Submitted Successfully!
//          </Alert>
//        </Snackbar>
//     </Box>
//   );
// };

// export default ApplyButton;






"use client";
import React, { useState, useEffect } from "react";
import { Button, Box, CircularProgress, Alert, Snackbar, Typography } from "@mui/material"; // Added Typography
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { JobApiResponse } from "@/types/Job/job";
import { useApplyWithProfile } from "@/hooks/job/useApplyWithProfile";

interface JobDetailsHeaderProps {
  job: NonNullable<JobApiResponse>;
}

const ApplyButton: React.FC<JobDetailsHeaderProps> = ({ job }) => {
  const { user } = useAuth();
  const {
    apply: applyWithProfile,
    isLoading,
    error,
    isSuccess
  } = useApplyWithProfile();
  const jobId = job.id;
  const isAlreadyApplied = job.isApplied; // Get the isApplied status

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEasyApply = async () => {
    if (!jobId) return;
    setShowSuccessMessage(false);
    await applyWithProfile({ jobId });
  };

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessMessage(true);
    }
  }, [isSuccess]);

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccessMessage(false);
  };

  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
      {user ? (
        <>
          {/* Conditionally render based on isAlreadyApplied */}
          {isAlreadyApplied ? (
             // If already applied, show the message
            <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              Already Applied
            </Typography>
          ) : (
            // If not applied, show the error and buttons
            <>
              {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

              <div className="flex flex-wrap items-center justify-center gap-2"> {/* Existing button container */}
                <Button
                  LinkComponent={Link}
                  href={`/jobs/apply/${jobId}`}
                  variant="outlined"
                  disabled={isLoading}
                  sx={{ textTransform: 'none' }}
                >
                  Apply with New Form
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEasyApply}
                  disabled={isLoading || (isSuccess && !error)}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ textTransform: 'none' }}
                >
                  {isLoading ? 'Applying...' : (isSuccess && !error ? 'Applied Successfully!' : 'Easy Apply with Job Profile')}
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
         // If user is not logged in, show the sign-in message
        <Box sx={{ typography: 'body1', color: 'text.secondary' }}>
          Sign in to apply for this job
        </Box>
      )}

      {/* Snackbar for Success Message (only relevant if application was just submitted) */}
      {!isAlreadyApplied && ( // Only show snackbar if the user *could* apply (i.e., wasn't already applied)
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }} variant="filled">
            Application Submitted Successfully!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default ApplyButton;