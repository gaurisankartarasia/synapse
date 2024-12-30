"use client";
import React, { useState, useEffect } from 'react'
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import Image from 'next/image';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    useDraggable,
    Textarea,
    Spinner
} from "@nextui-org/react";
import { useRouter } from 'next/navigation';


export default function UploadModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const targetRef = React.useRef(null);
    const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });
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
        <>
            <Button onPress={onOpen} radius='sm' variant='flat' >
                <span className="material-symbols-outlined">
                    add_photo_alternate
                </span>
                <span className='hidden lg:block'> Upload</span></Button>
            <Modal
                size='4xl'
                ref={targetRef}
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader {...moveProps} className="flex flex-col gap-1">Upload</ModalHeader>
                            <ModalBody>
                            <div className="p-4 text-center">
      {loading &&   <Spinner className='text-center mx-auto'/>}
      
      <Textarea
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        placeholder="Post Title"
        className="mb-4"
      />
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content here..."
        className=" mb-4"
      />

      <div className="mb-4">
        {/* <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          className="mb-2"
        /> */}
        <label htmlFor="file-upload" className="cursor-pointer mx-auto bg-blue-500 p-2 mt-3 text-white rounded">
  Upload from storage
</label>
<input
  id="file-upload"
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  multiple
  className="hidden"
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
        <p className="text-sm text-gray-500 mt-3">
          {images.length}/4 images selected
        </p>
      </div>

    
    </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className=''  variant="flat" onPress={onClose}>
                                    Exit
                                </Button>
                                <Button color="primary" radius='sm' onPress={handleSubmit}>
                                    Post
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
