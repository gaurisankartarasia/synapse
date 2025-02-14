// src/app/post/create/components/ImageUploader.tsx
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
}

export const ImageUploader = ({ onImagesChange, maxImages = 4 }: ImageUploaderProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  useEffect(() => {
    const newImageURLs = images.map(file => URL.createObjectURL(file));
    setImageURLs(newImageURLs);

    return () => {
      newImageURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      if (images.length + selectedFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }
      const newImages = [...images, ...selectedFiles];
      setImages(newImages);
      onImagesChange(newImages);
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
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple
        className="mb-2"
      />
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
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <p className="text-sm t500 mt-1">
        {images.length}/{maxImages} images selected
      </p>
    </div>
  );
};
