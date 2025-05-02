
// // src/components/job/ProfileCard.tsx
// import React, { useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { fetchProfile as fetchJobProfileData } from '@/redux/features/jobProfileSlice'; // Rename import if needed
// // You might need to import the fetchProfile for the user slice if you want to trigger it here
// // import { fetchProfile as fetchUserProfileData } from '@/redux/features/userSlice';

// // Progress Ring Component (remains the same)
// const ProgressRing: React.FC<{ percentage: number, size: number, strokeWidth: number }> = ({
//   percentage,
//   size,
//   strokeWidth
// }) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       <circle stroke="#e0e0e0" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
//       <circle stroke="#4CAF50" fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" r={radius} cx={size / 2} cy={size / 2} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
//       <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#424242">
//         {percentage}%
//       </text>
//     </svg>
//   );
// };


// // Main Profile Card Component
// const JobProfileCard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   // Select data from jobProfile slice
//   const { profile: jobProfile, completionPercentage, loading: jobProfileLoading } = useSelector((state: RootState) => state.jobProfile);

//   // Select data from user slice
//   // Use a more descriptive name like userState to avoid confusion
//   const userState = useSelector((state: RootState) => state.user);
//   // Extract the nested profile object
//   const userProfile = userState.profile; // This is UserProfile | null
//   const userLoading = userState.loading; // User slice loading state

//   // Fetch job profile data when component mounts
//   useEffect(() => {
//     dispatch(fetchJobProfileData());
//     // Optionally fetch user profile data if it's not guaranteed to be loaded elsewhere
//     // dispatch(fetchUserProfileData());
//   }, [dispatch]);

//   // Handle click on complete profile button
//   const handleCompleteProfile = () => {
//     router.push('/profile/edit');
//   };

//   // Combine loading states if necessary, or decide priority
//   // Here, we prioritize the jobProfile loading for the skeleton
//   if (jobProfileLoading || !jobProfile) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto animate-pulse">
//         {/* Skeleton content */}
//         <div className="flex flex-col items-center">
//           <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
//           <div className="mt-4 h-5 bg-gray-200 rounded w-3/4"></div>
//           <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
//           <div className="mt-2 h-4 bg-gray-200 rounded w-2/3"></div>
//           <div className="mt-4 h-10 bg-gray-200 rounded w-full"></div>
//         </div>
//       </div>
//     );
//   }

//   // --- CORRECTION: Access properties via userProfile (which is userState.profile) ---
//   // Use optional chaining extensively as userProfile can be null
//   const displayName = userProfile?.displayName || 'Your Profile';
//   const photoURL = userProfile?.profilePhotoURL; // Correct property name

//   // Get details from the jobProfile slice
//   const education = jobProfile.education && jobProfile.education.length > 0
//     ? `@ ${jobProfile.education[0].institution}`
//     : '';
//   const headline = jobProfile.headline || 'Add your headline';

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
//       <div className="flex flex-col items-center">
//         {/* Profile Image with Progress Ring */}
//         <div className="relative">
//           <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-white">
//             {/* --- CORRECTION: Check photoURL variable --- */}
//             {photoURL ? (
//               <Image
//                 src={photoURL} // Use the derived variable
//                 alt="Profile"
//                 width={96}
//                 height={96}
//                 className="object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500 text-xl">
//                   {displayName.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Progress Ring */}
//           <div className="absolute top-0 left-0">
//             <ProgressRing
//               percentage={completionPercentage}
//               size={96}
//               strokeWidth={4}
//             />
//           </div>
//         </div>

//         {/* Profile Details */}
//         {/* --- CORRECTION: Use derived displayName variable --- */}
//         <h3 className="mt-4 text-lg font-semibold text-gray-800">{displayName}</h3>
//         {/* Use headline/education from jobProfile */}
//         <p className="text-sm text-gray-600">{headline}</p>
//         {education && <p className="text-xs text-gray-500">{education}</p>}
//         <p className="text-xs text-gray-400">Last updated today</p>

//         {/* Complete Profile Button */}
//         <button
//           onClick={handleCompleteProfile}
//           className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-full transition duration-200"
//         >
//           {completionPercentage < 100 ? 'Complete profile' : 'View profile'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobProfileCard;






// // src/components/job/ProfileCard.tsx
// import React, { useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { fetchProfile as fetchJobProfileData } from '@/redux/features/jobProfileSlice'; // Rename import if needed
// // You might need to import the fetchProfile for the user slice if you want to trigger it here
// // import { fetchProfile as fetchUserProfileData } from '@/redux/features/userSlice';

// // Progress Ring Component (remains the same)
// const ProgressRing: React.FC<{ percentage: number, size: number, strokeWidth: number }> = ({
//   percentage,
//   size,
//   strokeWidth
// }) => {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       <circle stroke="#e0e0e0" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
//       <circle stroke="#4CAF50" fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" r={radius} cx={size / 2} cy={size / 2} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
//       <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#424242">
//         {percentage}%
//       </text>
//     </svg>
//   );
// };


// // Main Profile Card Component
// const JobProfileCard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   // Select data from jobProfile slice
//   // Rename jobProfileLoading to avoid conflict if using userLoading later
//   const {
//     profile: jobProfile,
//     completionPercentage,
//     loading: isJobProfileLoading, // Renamed for clarity
//     error: jobProfileError // Also select error for potential checks
//   } = useSelector((state: RootState) => state.jobProfile);

//   // Select data from user slice (assuming it's managed similarly or fetched elsewhere)
//   const { profile: userProfile } = useSelector((state: RootState) => state.user);

//   // Fetch job profile data ONLY if it's not already loaded and not currently loading
//   useEffect(() => {
//     // Condition: Fetch only if profile is null AND not currently loading.
//     // This prevents refetching if data exists or if a fetch is already in progress.
//     if (!jobProfile && !isJobProfileLoading) {
//        console.log("JobProfileCard: No profile data found, dispatching fetchJobProfileData..."); // Optional: for debugging
//        dispatch(fetchJobProfileData());
//     }
//     // Optionally fetch user profile data using a similar conditional logic if needed
//     // if (!userProfile && !userLoading) { // Assuming user slice has 'loading' state
//     //   dispatch(fetchUserProfileData());
//     // }
//   }, [dispatch, jobProfile, isJobProfileLoading]); // Add dependencies that trigger the effect check

//   // Handle click on complete profile button
//   const handleCompleteProfile = () => {
//     router.push('/profile/edit'); // Adjust route as needed
//   };

//   // --- LOADING STATE ---
//   // Show skeleton if loading OR if the profile is still null (initial state before first fetch attempt)
//   // AND there's no error. If there's an error, we might want to show an error message instead.
//   if (isJobProfileLoading || (!jobProfile && !jobProfileError)) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto animate-pulse">
//         {/* Skeleton content */}
//         <div className="flex flex-col items-center">
//           <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
//           <div className="mt-4 h-5 bg-gray-200 rounded w-3/4"></div>
//           <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
//           <div className="mt-2 h-4 bg-gray-200 rounded w-2/3"></div>
//           <div className="mt-4 h-10 bg-gray-200 rounded w-full"></div>
//         </div>
//       </div>
//     );
//   }

//   // --- ERROR STATE ---
//   // Optionally handle error state explicitly
//   if (jobProfileError) {
//      return (
//        <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto text-center text-red-500">
//          Failed to load profile data. Please try again later.
//          {/* Optionally add a retry button */}
//          {/* <button onClick={() => dispatch(fetchJobProfileData())}>Retry</button> */}
//        </div>
//      );
//   }

//   // --- RENDER PROFILE (Data available) ---
//   // Check if jobProfile is definitely not null before accessing its properties
//   if (!jobProfile) {
//     // This case should ideally be covered by loading/error states,
//     // but it's a safeguard.
//     return null; // Or some fallback UI
//   }

//   // Access properties via userProfile (which is userState.profile)
//   const displayName = userProfile?.displayName || 'Your Profile';
//   const photoURL = userProfile?.profilePhotoURL;

//   // Get details from the jobProfile slice (safe now because we checked !jobProfile)
//   const education = jobProfile.education && jobProfile.education.length > 0
//     ? `@ ${jobProfile.education[0].institution}`
//     : '';
//   const headline = jobProfile.headline || 'Add your headline';

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto">
//       <div className="flex flex-col items-center">
//         {/* Profile Image with Progress Ring */}
//         <div className="relative">
//           <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-white">
//             {photoURL ? (
//               <Image
//                 src={photoURL}
//                 alt="Profile"
//                 width={96}
//                 height={96}
//                 className="object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500 text-xl">
//                   {displayName.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Progress Ring */}
//           <div className="absolute top-0 left-0">
//             <ProgressRing
//               percentage={completionPercentage}
//               size={96}
//               strokeWidth={4}
//             />
//           </div>
//         </div>

//         {/* Profile Details */}
//         <h3 className="mt-4 text-lg font-semibold text-gray-800">{displayName}</h3>
//         <p className="text-sm text-gray-600">{headline}</p>
//         {education && <p className="text-xs text-gray-500">{education}</p>}
//         {/* Consider making "Last updated" dynamic if possible, otherwise remove or keep static */}
//         {/* <p className="text-xs text-gray-400">Last updated today</p> */}

//         {/* Complete Profile Button */}
//         <button
//           onClick={handleCompleteProfile}
//           className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-full transition duration-200"
//         >
//           {completionPercentage < 100 ? 'Complete profile' : 'View profile'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobProfileCard;






// src/components/job/ProfileCardMui.tsx
import React, { useEffect } from 'react';
import Image from 'next/image'; // Still needed if using Next Image within Avatar
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchProfile as fetchJobProfileData } from '@/redux/features/jobProfileSlice';

// --- Material-UI Imports ---
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
// --- End Material-UI Imports ---

// Progress Ring Component using MUI CircularProgress
const MuiProgressRing: React.FC<{ value: number; size?: number }> = ({ value, size = 96 }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      {/* Background track */}
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
          position: 'absolute', // Ensure it's behind the value progress
          left: 0,
          zIndex: 1, // Behind value progress
        }}
        size={size}
        thickness={4}
        value={100} // Full circle for the background
      />
      {/* Value progress */}
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={4}
        sx={{
          color: 'primary.main', // Or use '#4CAF50' directly if preferred
          zIndex: 2, // Above background
          // Add rotation if needed, though usually starts from the top
          // transform: 'rotate(-90deg)',
        }}
      />
       {/* Percentage Text - Optional, MUI doesn't provide this out of the box with CircularProgress */}
       <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3, // Above progress rings but below avatar content if overlapped
        }}
      >
        {/* Hide text if needed, the original didn't have text inside the ring itself */}
        {/* <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography> */}
      </Box>
    </Box>
  );
};


// Main Profile Card Component using MUI
const JobProfileCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    profile: jobProfile,
    completionPercentage,
    loading: isJobProfileLoading,
    error: jobProfileError
  } = useSelector((state: RootState) => state.jobProfile);

  const { profile: userProfile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!jobProfile && !isJobProfileLoading) {
       console.log("JobProfileCard: No profile data found, dispatching fetchJobProfileData...");
       dispatch(fetchJobProfileData());
    }
  }, [dispatch, jobProfile, isJobProfileLoading]);

  const handleCompleteProfile = () => {
    router.push('/jobs/profile?edit=true'); // Adjust route as needed
  };

  // --- LOADING STATE ---
  if (isJobProfileLoading || (!jobProfile && !jobProfileError)) {
    return (
      <Card sx={{ maxWidth: 345, mx: 'auto', p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="circular" width={96} height={96} sx={{ mb: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: '1.1rem', width: '80%', mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%', mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '0.75rem', width: '70%', mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={40} />
        </CardContent>
      </Card>
    );
  }

  // --- ERROR STATE ---
  if (jobProfileError) {
     return (
       <Card sx={{ maxWidth: 345, mx: 'auto', p: 2 }}>
           <Alert severity="error" sx={{ width: '100%' }}>
                Failed to load profile data. Please try again later.
                {/* Optionally add a retry button */}
                {/* <Button size="small" onClick={() => dispatch(fetchJobProfileData())} sx={{ ml: 1 }}>Retry</Button> */}
           </Alert>
       </Card>
     );
  }

  // --- RENDER PROFILE (Data available) ---
  if (!jobProfile) {
    // Safeguard: Should be covered by loading/error states
    return null;
  }

  // Access properties
  const displayName = userProfile?.displayName || 'Your Profile';
  const photoURL = userProfile?.profilePhotoURL;
  const education = jobProfile.education && jobProfile.education.length > 0
    ? ` ${jobProfile.education[0].institution}`
    : '';
  const headline = jobProfile.headline || 'Add your headline';

  const avatarSize = 96; // Define avatar size for consistency

  return (
    <Card sx={{ maxWidth: 345, mx: 'auto', p: 2 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Profile Image with Progress Ring */}
        <Box sx={{ position: 'relative', width: avatarSize, height: avatarSize, mb: 2 }}>
           {/* Progress Ring */}
           <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
             <MuiProgressRing value={completionPercentage} size={avatarSize} />
           </Box>

           {/* Avatar */}
           <Avatar
             sx={{
               width: avatarSize - 8, // Slightly smaller than the ring for visual spacing
               height: avatarSize - 8,
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)', // Center the avatar within the ring
               zIndex: 2, // Avatar above the ring background
               bgcolor: 'grey.200', // Background if no image
               fontSize: '2rem', // Size for initial letter
             }}
           >
             {photoURL ? (
             
               <Image src={photoURL} alt="Profile" layout="fill" objectFit="cover" />
             ) : (
               displayName.charAt(0).toUpperCase()
             )}
           </Avatar>
          
        </Box>
        {/* Progress Ring Text - Optional */}
        <Typography variant="subtitle1"  color="text.secondary">
          {`${Math.round(completionPercentage)}%`}
        </Typography>
        {/* Profile Details */}
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'semibold' }}>
          {displayName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {headline}
        </Typography>
        {education && (
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {education}
          </Typography>
        )}
        {/* <Typography variant="caption" color="text.disabled">Last updated today</Typography> */}

        {/* Complete Profile Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCompleteProfile}
          sx={{ mt: 2 }} // Add margin top using theme spacing
        >
          {completionPercentage < 100 ? 'Complete profile' : 'View profile'}
        </Button>

      </CardContent>
    </Card>
  );
};

export default JobProfileCard;