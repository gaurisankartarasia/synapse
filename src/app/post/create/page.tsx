

// "use client";
// import { useState, useEffect } from "react";
// import Image from 'next/image';
// import { useRouter } from "next/navigation";
// import { auth } from "@/lib/firebaseClient";
// import { onAuthStateChanged, getIdToken } from "firebase/auth";

// const PostPage = () => {
//   const router = useRouter();
//   const [postTitle, setPostTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [userToken, setUserToken] = useState<string | null>(null);
//   const [images, setImages] = useState<File[]>([]);
//   const [imageUrls, setImageUrls] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

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
//     const newImageUrls = images.map(file => URL.createObjectURL(file));
//     setImageUrls(newImageUrls);

//     // Cleanup function to revoke object URLs
//     return () => {
//       newImageUrls.forEach(url => URL.revokeObjectURL(url));
//     };
//   }, [images]);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLinputElement>) => {
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
//     setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     if (!postTitle || !content) {
//       alert("Post title and content are required.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const uploadedImageUrls = [];

//       // Upload each image
//       for (const image of images) {
//         const formData = new FormData();
//         formData.append("image", image);

//         const imageResponse = await fetch("/api/upload_post_img", {
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
//         uploadedImageUrls.push(imageData.imageUrl);
//       }

//       // Submit the post with all image URLs
//       const response = await fetch("/api/post", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userToken}`,
//         },
//         body: JSON.stringify({
//           title: postTitle,
//           content,
//           imageUrls: uploadedImageUrls,
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
//       {loading && <div className="text-center py-2">Loading...</div>}
      
//       <input
//         type="text"
//         value={postTitle}
//         onChange={(e) => setPostTitle(e.target.value)}
//         placeholder="Post Title"
//         className="w-full p-2 mb-4 border rounded"
//       />
      
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write your content here..."
//         className="w-full p-2 mb-4 border rounded min-h-[200px]"
//       />

//       <div className="mb-4">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           multiple
//           className="mb-2"
//         />
//         <div className="flex gap-4 flex-wrap">
//           {imageUrls.map((url, index) => (
//             <div key={index} className="relative">
//               <Image
//                 src={url}
//                 width={100}
//                 height={100}
//                 alt={`Preview ${index + 1}`}
//                 className="object-cover rounded"
//               />
//               <Button
//                 onClick={() => removeImage(index)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
//               >
//                 ×
//               </Button>
//             </div>
//           ))}
//         </div>
//         <p className="text-sm text-gray-500 mt-1">
//           {images.length}/4 images selected
//         </p>
//       </div>

//       <div className="flex gap-4">
//         <Button
//           onClick={handleSubmit}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           disabled={loading}
//         >
//           Post
//         </Button>
//         <Button
//           onClick={() => router.push("/")}
//           className="px-4 py-2 border rounded"
//           disabled={loading}
//         >
//           Cancel
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PostPage;











"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { Button } from "@mui/material";

const PostPage = () => {
  const router = useRouter();
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getIdToken(currentUser);
        setUserToken(token);
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Create preview URLs for selected images
    const newImageUrls = images.map(file => URL.createObjectURL(file));
    setImageUrls(newImageUrls);

    // Cleanup function to revoke object URLs
    return () => {
      newImageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      if (images.length + selectedFiles.length > 4) {
        alert("Maximum 4 images allowed");
        return;
      }
      setImages(prevImages => [...prevImages, ...selectedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!postTitle || !content) {
      alert("Post title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrls = [];

      // Upload each image
      for (const image of images) {
        const formData = new FormData();
        formData.append("image", image);

        const imageResponse = await fetch("/api/upload_post_img", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error("Image upload failed");
        }

        const imageData = await imageResponse.json();
        uploadedImageUrls.push(imageData.imageUrl);
      }

      // Submit the post with all image URLs
      const response = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          title: postTitle,
          content,
          imageUrls: uploadedImageUrls,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Write a post</h1>
      {loading && <div className="text-center py-2">Loading...</div>}
      
      <input
        type="text"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full p-2 mb-4 border rounded"
      />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content here..."
        className="w-full p-2 mb-4 border rounded min-h-[200px]"
      />

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          className="mb-2"
        />
        <div className="flex gap-4 flex-wrap">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <Image
                src={url}
                width={100}
                height={100}
                alt={`Preview ${index + 1}`}
                className="object-cover rounded"
              />
              <Button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {images.length}/4 images selected
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          Post
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="px-4 py-2 border rounded"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PostPage;