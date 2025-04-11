// src/components/StoryUpload.tsx
import React, { useState, useCallback } from 'react';
import { Close, Upload } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';


interface ImageUploadProps {
  onUploadComplete?: (storyId: string) => void;
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !title.trim()) {
     
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch('/api/stories/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { storyId } = await response.json();
      onUploadComplete?.(storyId);
    
      
      // Reset form
      setTitle('');
      setDescription('');
      removeImage();
    } catch (error) {
      console.error('Upload error:', error);
     
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-4 space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={300}
                className="mx-auto rounded-md"
                objectFit="cover"
              />
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-md text-white hover:bg-red-600"
                >
                  <Close />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Drop your image here, or click to select
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG or WEBP (max. 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            placeholder="Story title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
          />
          <textarea
            placeholder="Story description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            rows={3}
          />
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <button
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedFile || !title.trim() || isUploading}
        >
          {isUploading ? (
            <>
              <CircularProgress  />
              Uploading...
            </>
          ) : (
            'Upload Story'
          )}
        </button>
      </div>
    </div>
  );
}