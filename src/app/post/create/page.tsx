
// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { createPost, setDirty, resetPostState } from '@/redux/features/postSlice';

// import { CircularProgress, MD3Switch , Button} from "@mui/material";


// import { ImageUploader } from '../../../components/Post/Create/ImageUploader';
// import { HashtagInput } from '../../../components/Post/Create/HashtagInput';
// import { MentionTextarea } from '../../../components/Post/Create/TextArea';
// import { uploadImages } from '@/utils/imageUpload';
// import { useAuth } from '@/hooks/useAuth';

// const PostPage = () => {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading: postLoading, error: postError } = useSelector((state: RootState) => state.post);
//   const { user, loading: authLoading, error: authError, isAuthenticated } = useAuth();
  
//   const [content, setContent] = useState("");
//   const [hashtags, setHashtags] = useState<string[]>([]);
//   const [images, setImages] = useState<File[]>([]);
//   const [allowCommenting, setAllowCommenting] = useState<boolean>(true);
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       router.push("/signin");
//     }
//   }, [authLoading, isAuthenticated, router]);

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (content || images.length > 0) {
//         dispatch(setDirty(true));
//         e.preventDefault();
//         e.returnValue = '';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       dispatch(resetPostState());
//     };
//   }, [content, images, dispatch]);

//   const handleSubmit = async () => {
//     if (!isAuthenticated || !user) {
//       return;
//     }

//     try {
//       setUploadLoading(true);
      
//       // Get fresh authentication state by making API request
//       const authResponse = await fetch('/api/auth/verify_jwt', {
//         credentials: 'include'
//       });
      
//       if (!authResponse.ok) {
//         throw new Error('Authentication failed. Please log in again.');
//       }

//       const uploadedImageURLs = await uploadImages(images);
      
//       await dispatch(createPost({
//         content,
//         imageURLs: uploadedImageURLs,
//         hashtags,
//         allowCommenting,
//         uid: user.id
//       })).unwrap();
      
//       router.push("/");
//     } catch (error) {
//       console.error("Error posting:", error);
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const isLoading = postLoading || authLoading || uploadLoading;
//   const error = postError || authError;

//   if (authLoading) {
//     return (
//      null
//     );
//   }

//   if (!isAuthenticated) {
//     return null; // Redirect will happen in useEffect
//   }

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <b className="text-2xl mb-4">Create a post</b>
//       {isLoading && <CircularProgress />}
//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       <ImageUploader 
//         onImagesChange={setImages}
//         maxImages={4}
//       />

//       <MentionTextarea
//         value={content}
//         onChange={(newContent) => {
//           setContent(newContent);
//           dispatch(setDirty(true));
//         }}
//         placeholder="Write your content here..."
//         className="w-full p-2 mb-4 min-h-[200px]"
//       />

//       <HashtagInput
//         onChange={(newHashtags) => {
//           setHashtags(newHashtags);
//           dispatch(setDirty(true));
//         }}
//       />




//       <div className="flex items-center mb-4">
//         <div className="flex items-center space-x-2">
//           <p >Allow Commenting</p>  
//           <MD3Switch
//             id="allow-commenting"
//             checked={allowCommenting}
//             onChange={(checked) => {
//               setAllowCommenting(checked);
//               dispatch(setDirty(true));
//             }}
//           /> 
//         </div>
//       </div>

//       <div className="flex gap-4">
//         <Button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           variant="contained"
//         >
//           Upload
//         </Button>
//         <Button
//           onClick={() => router.push("/")}
//           disabled={isLoading}
//           variant="outlined"
//         >
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PostPage;







"use client";
import { useState, useEffect, ChangeEvent } from "react"; // Import ChangeEvent
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createPost, setDirty, resetPostState } from '@/redux/features/postSlice';

import { CircularProgress,  Button } from "@mui/material";
import MD3Switch from '@/components/Switch'

import { ImageUploader } from '../../../components/Post/Create/ImageUploader';
import { HashtagInput } from '../../../components/Post/Create/HashtagInput';
import { MentionTextarea } from '../../../components/Post/Create/TextArea';
import { uploadImages } from '@/utils/imageUpload';
import { useAuth } from '@/hooks/useAuth';

const PostPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading: postLoading, error: postError } = useSelector((state: RootState) => state.post);
  const { user, loading: authLoading, error: authError, isAuthenticated } = useAuth();

  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [allowCommenting, setAllowCommenting] = useState<boolean>(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle unsaved changes before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check Redux state for dirty flag or check local state directly
      // Using local state might be simpler if Redux state isn't strictly needed for this check
      if (content || images.length > 0 || hashtags.length > 0) {
        // Optionally set Redux dirty flag if needed elsewhere
        dispatch(setDirty(true));
        e.preventDefault(); // Standard way to trigger the confirmation dialog
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Reset Redux post state only when component unmounts naturally,
      // not necessarily on every navigation away if using beforeunload.
      // Consider if this reset logic is exactly what you need.
      // dispatch(resetPostState()); // Might reset state even if user cancels navigation
    };
  }, [content, images, hashtags, dispatch]); // Add hashtags to dependency array

  // Reset Redux state when component unmounts (e.g., successful post or cancellation)
  useEffect(() => {
    return () => {
      dispatch(resetPostState());
    };
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      // Optionally show a message or redirect
      console.error("User not authenticated");
      router.push("/signin");
      return;
    }

    // Prevent submission if content is empty and no images are selected
    if (!content.trim() && images.length === 0) {
      alert("Please add content or images to your post."); // Or use a more sophisticated notification
      return;
    }

    setUploadLoading(true);
    dispatch(setDirty(false)); // Mark as not dirty since we are submitting

    try {
      // Removed the redundant auth check as useAuth handles it
      // and protects the page/component access.

      const uploadedImageURLs = await uploadImages(images);

      await dispatch(createPost({
        content,
        imageURLs: uploadedImageURLs,
        hashtags,
        allowCommenting,
        uid: user.id // Assuming user object has an 'id' property
      })).unwrap(); // unwrap allows catching rejected promises

      // Reset local state after successful post
      setContent("");
      setHashtags([]);
      setImages([]);
      setAllowCommenting(true);

      router.push("/"); // Navigate after successful post
    } catch (error: any) { // Catch specific errors if possible
      console.error("Error posting:", error);
      // Display error to the user using a snackbar or alert
      alert(`Failed to create post: ${error.message || 'Unknown error'}`);
      dispatch(setDirty(true)); // Re-mark as dirty if submission failed
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    if (content || images.length > 0 || hashtags.length > 0) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        dispatch(setDirty(false)); // Mark as not dirty because user confirmed cancellation
        router.push("/");
      }
      // If user clicks 'Cancel' in the confirmation, do nothing.
    } else {
      // No unsaved changes, navigate directly
      router.push("/");
    }
  };


  const isLoading = postLoading || authLoading || uploadLoading;
  // Combine errors - choose a display strategy (show first, show all, etc.)
  const displayError = postError || authError;

  // Render loading indicator centrally if auth is loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // If authentication check finished and user is not authenticated,
  // this return null prevents rendering the form before redirection occurs.
  if (!isAuthenticated) {
    return null;
  }

  // Main component render
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a Post</h1> {/* Use h1 for semantic heading */}

      {/* Display loading indicator during post submission */}
      {isLoading && (
          <div className="fixed inset-0 bg-gray-200/50 bg-opacity-50 flex justify-center items-center z-50">
              <CircularProgress />
          </div>
      )}

      {/* Display errors */}
      {displayError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{displayError}</div>}

      <ImageUploader
        onImagesChange={(newImages) => {
            setImages(newImages);
            dispatch(setDirty(true));
        }}
        maxImages={4}
      />

      <MentionTextarea
        value={content}
        onChange={(newContent) => {
          setContent(newContent);
          dispatch(setDirty(true));
        }}
        placeholder="What's on your mind?"
        className="w-full p-2 mb-4 min-h-[150px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" // Added basic styling
      />

      <HashtagInput
        onChange={(newHashtags) => {
          setHashtags(newHashtags);
          dispatch(setDirty(true));
        }}
      />

      <div className="flex items-center justify-between mb-6 mt-4"> {/* Added mt-4 for spacing */}
        <label htmlFor="allow-commenting" className="flex items-center space-x-2 cursor-pointer"> {/* Use label */}
          <span>Allow Commenting</span>
           <MD3Switch

            id="allow-commenting"
            checked={allowCommenting}
            // Corrected onChange handler:
            onChange={(event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
              setAllowCommenting(checked); // Use the second argument (the boolean value)
              dispatch(setDirty(true));
            }}
            inputProps={{ 'aria-label': 'Allow commenting toggle' }} // Accessibility
          />
        </label>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || (!content.trim() && images.length === 0)} // Disable if loading or no content/images
          variant="contained"
          color="primary" // Use theme colors
        >
          {isLoading ? 'Posting...' : 'Upload'}
        </Button>
        <Button
          onClick={handleCancel} // Use the new cancel handler
          disabled={isLoading} // Disable only if loading an operation
          variant="outlined"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PostPage;