//src/app/post/create/page.tsx
"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { CircularProgress, Switch } from "@mui/material";

const PostPage = () => {
  const router = useRouter();
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allowCommenting, setAllowCommenting] = useState<boolean>(true);


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


  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagInput = e.target.value;
    // Split by comma, trim whitespace, remove empty strings, and remove # if added
    const newHashtags = hashtagInput
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag !== '');
    
    setHashtags(newHashtags);
  };


  const handleCommentingToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowCommenting(event.target.checked); // Toggle the boolean value
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uploadedImageUrls = [];

      // Upload each image
      for (const image of images) {
        const formData = new FormData();
        formData.append("image", image);

        const imageResponse = await fetch("/api/post/upload_post_img", {
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

      // Submit the post with all image URLs and hashtags
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
          hashtags: hashtags,
          allowCommenting,
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
      {loading && <CircularProgress/>}
      
      
   

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


              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {images.length}/4 images selected
        </p>
      </div>
   
   <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content here..."
        className="w-full p-2 mb-4 border rounded min-h-[200px]"
      />
 <div className="mb-4">
        <input
          type="text"
          placeholder="Add hashtags (comma-separated, e.g., tech, programming)"
          onChange={handleHashtagChange}
          className="w-full p-2 mb-2 border rounded"
        />
        {hashtags.length > 0 && (
          <div className="flex gap-2 mb-2">
            {hashtags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center mb-4">
        <span className="mr-2">Allow Commenting</span>
        <Switch
          checked={allowCommenting}
          onChange={handleCommentingToggle}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          Post
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 border rounded"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostPage;





