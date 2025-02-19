// //src/app/post/create/page.tsx
// "use client";
// import { useState, useEffect } from "react";
// import Image from 'next/image';
// import { useRouter } from "next/navigation";
// import { auth } from "@/lib/firebaseClient";
// import { onAuthStateChanged, getIdToken } from "firebase/auth";
// import { Spinner } from "@/components/ui/spinner";
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import {Textarea} from '@/components/ui/textarea'
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";


// const PostPage = () => {
//   const router = useRouter();
//   const [content, setContent] = useState("");
//   const [hashtags, setHashtags] = useState<string[]>([]);
//   const [userToken, setUserToken] = useState<string | null>(null);
//   const [images, setImages] = useState<File[]>([]);
//   const [imageURLs, setimageURLs] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [allowCommenting, setallowCommenting] = useState<boolean>(true);


//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const token = await getIdToken(currentUser);
//         setUserToken(token);
//       } else {
//         router.push("/signin");
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   useEffect(() => {
//     // Create preview URLs for selected images
//     const newimageURLs = images.map(file => URL.createObjectURL(file));
//     setimageURLs(newimageURLs);

//     // Cleanup function to revoke object URLs
//     return () => {
//       newimageURLs.forEach(url => URL.revokeObjectURL(url));
//     };
//   }, [images]);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     if (selectedFiles.length > 0) {
//       if (images.length + selectedFiles.length > 4) {
//         alert("Maximum 4 images allowed");
//         return;
//       }
//       setImages(prevImages => [...prevImages, ...selectedFiles]);
//     }
//   };

//   const removeImage = (index: number) => {
//     setImages(prevImages => prevImages.filter((_, i) => i !== index));
//     setimageURLs(prevUrls => prevUrls.filter((_, i) => i !== index));
//   };


//   const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const hashtagInput = e.target.value;
//     // Split by comma, trim whitespace, remove empty strings, and remove # if added
//     const newHashtags = hashtagInput
//       .split(',')
//       .map(tag => tag.trim().replace(/^#/, ''))
//       .filter(tag => tag !== '');
    
//     setHashtags(newHashtags);
//   };


//   const handleCommentingToggle = (checked: boolean) => {
//     setallowCommenting(checked);
//   };
  
  
//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const uploadedimageURLs = [];

//       // Upload each image
//       for (const image of images) {
//         const formData = new FormData();
//         formData.append("image", image);

//         const imageResponse = await fetch("/api/post/upload_post_img", {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//           },
//           body: formData,
//         });

//         if (!imageResponse.ok) {
//           throw new Error("Image upload failed");
//         }

//         const imageData = await imageResponse.json();
//         uploadedimageURLs.push(imageData.imageURL);
//       }

//       // Submit the post with all image URLs and hashtags
//       const response = await fetch("/api/post/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userToken}`,
//         },
//         body: JSON.stringify({
//           content,
//           imageURLs: uploadedimageURLs,
//           hashtags: hashtags,
//           allowCommenting,
//         }),
//       });

//       if (response.ok) {
//         router.push("/");
//       } else {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.error}`);
//       }
//     } catch (error) {
//       console.error("Error posting:", error);
//       alert("Failed to post.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Write a post</h1>
//       {loading && <Progress />}
      
      
   

//       <div className="mb-4">
//         <Input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           multiple
//           className="mb-2"
//         />
//         <div className="flex gap-4 flex-wrap">
//           {imageURLs.map((url, index) => (
//             <div key={index} className="relative">
//               <Image
//                 src={url}
//                 width={100}
//                 height={100}
//                 alt={`Preview ${index + 1}`}
//                 className="object-cover rounded"
//               />


//               <button
//                 onClick={() => removeImage(index)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//         <p className="text-sm t500 mt-1">
//           {images.length}/4 images selected
//         </p>
//       </div>
   
//    <Textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write your content here..."
//         className="w-full p-2 mb-4   min-h-[200px]"
//       />
//  <div className="mb-4">
//         <Input
//           type="text"
//           placeholder="Add hashtags (comma-separated, e.g., tech, programming)"
//           onChange={handleHashtagChange}
//         />
//         {hashtags.length > 0 && (
//           <div className="flex gap-2 mb-2">
//             {hashtags.map((tag, index) => (
//               <span 
//                 key={index} 
//                 className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="flex items-center mb-4">
    
//           <div className="flex items-center space-x-2">
//   <Label htmlFor="allow-commenting">Allow Commenting</Label>  
//     <Switch
//     id="allow-commenting"
//           checked={allowCommenting}
//           onCheckedChange={handleCommentingToggle}
//         /> 
//     </div>
//       </div>

//       <div className="flex gap-4">
//         <Button
//           onClick={handleSubmit}
//           disabled={loading}
//         >
//           Upload
//         </Button>
//         <Button
//           onClick={() => router.push("/")}
//           disabled={loading}
//           variant="secondary"        >
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PostPage;







// src/app/post/create/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { createPost, setDirty, resetPostState } from '@/redux/features/postSlice';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageUploader } from './components/ImageUploader';
import { HashtagInput } from './components/HashtagInput';
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content || images.length > 0) {
        dispatch(setDirty(true));
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      dispatch(resetPostState());
    };
  }, [content, images, dispatch]);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      setUploadLoading(true);
      
      // Get fresh authentication state by making API request
      const authResponse = await fetch('/api/auth/verify_jwt', {
        credentials: 'include'
      });
      
      if (!authResponse.ok) {
        throw new Error('Authentication failed. Please log in again.');
      }

      const uploadedImageURLs = await uploadImages(images);
      
      await dispatch(createPost({
        content,
        imageURLs: uploadedImageURLs,
        hashtags,
        allowCommenting,
        uid: user.id
      })).unwrap();
      
      router.push("/");
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const isLoading = postLoading || authLoading || uploadLoading;
  const error = postError || authError;

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Progress />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a post</h1>
      {isLoading && <Progress />}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ImageUploader 
        onImagesChange={setImages}
        maxImages={4}
      />

      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          dispatch(setDirty(true));
        }}
        placeholder="Write your content here..."
        className="w-full p-2 mb-4 min-h-[200px]"
      />

      <HashtagInput
        onChange={(newHashtags) => {
          setHashtags(newHashtags);
          dispatch(setDirty(true));
        }}
      />

      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="allow-commenting">Allow Commenting</Label>  
          <Switch
            id="allow-commenting"
            checked={allowCommenting}
            onCheckedChange={(checked) => {
              setAllowCommenting(checked);
              dispatch(setDirty(true));
            }}
          /> 
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Upload
        </Button>
        <Button
          onClick={() => router.push("/")}
          disabled={isLoading}
          variant="secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PostPage;