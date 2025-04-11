

// src/app/post/create/components/ImageUploader.tsx
import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import * as nsfwjs from 'nsfwjs';
import { Alert } from "@mui/material";
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({ onImagesChange, maxImages = 4 }: ImageUploaderProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const nsfwModel = useRef<nsfwjs.NSFWJS | null>(null);
  
  // Load NSFW model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load model from the default location
        nsfwModel.current = await nsfwjs.load();
      } catch (err) {
        console.error("Failed to load NSFW model:", err);
        setError("Failed to load content moderation tools. Some safety features may be disabled.");
      }
    };
    
    loadModel();
    
    // No explicit cleanup needed for tensorflow.js in this context
    return () => {
      // Model cleanup happens automatically
    };
  }, []);

  useEffect(() => {
    const newImageURLs = images.map(file => URL.createObjectURL(file));
    setImageURLs(newImageURLs);

    return () => {
      newImageURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const checkNSFWContent = async (file: File): Promise<boolean> => {
    if (!nsfwModel.current) {
      console.warn("NSFW model not loaded, skipping check");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Create an image element to pass to the model
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      
      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Classify the image
      const predictions = await nsfwModel.current.classify(img);
      
      // Clean up the object URL
      URL.revokeObjectURL(img.src);
      
      // Check if any NSFW categories have high probability
      const nsfw = predictions.find(p => 
        (p.className === 'Porn' || p.className === 'Sexy' || p.className === 'Hentai') && 
        p.probability > 0.7
      );
      
      return !!nsfw;
    } catch (err) {
      console.error("Error checking image:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    if (images.length + selectedFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      setIsLoading(false);
      return;
    }
    
    try {
      // Check each image for NSFW content
      for (const file of selectedFiles) {
        const isNSFW = await checkNSFWContent(file);
        
        if (isNSFW) {
          setError("Explicit content detected. Please upload appropriate images only.");
          setIsLoading(false);
          return;
        }
      }
      
      // If all images pass the check, add them
      const newImages = [...images, ...selectedFiles];
      setImages(newImages);
      onImagesChange(newImages);
    } catch (err) {
      console.error("Error processing images:", err);
      setError("An error occurred while processing your images.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
    setImageURLs(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
    

<Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      disabled={isLoading}
    >
      Upload
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageChange}
      />
    </Button>
      
      {isLoading && (
        <div className="my-2 text-sm text-blue-600">
          Checking image content... Please wait.
        </div>
      )}
      
   

      {error && (
        <Alert severity="warning" >
          
        {error}
        </Alert>
      )}
      
      <div className="flex gap-4 flex-wrap">
        {imageURLs.map((url, index) => (
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
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-md w-6 h-6 flex items-center justify-center"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <p className="text-sm mt-1">
        {images.length}/{maxImages} images selected
      </p>
    </div>
  );
};