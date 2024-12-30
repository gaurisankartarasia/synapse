// components/ImageGallery/ImageGallery.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import ZoomModal from './ZoomModal';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      {/* <div 
        className="relative aspect-video w-full overflow-hidden rounded-lg cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      > */}
      <div 
  className="relative aspect-video w-full overflow-hidden rounded-lg cursor-zoom-in z-10"
  onClick={() => setIsZoomed(true)}
>

        <Image
          src={images[activeImageIndex]}
          fill
          priority
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          alt={`Image ${activeImageIndex + 1}`}
          quality={90}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((url, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden 
                ${index === activeImageIndex ? 'ring-2 ring-blue-500' : ''}`}
            >
              <Image
                src={url}
                fill
                sizes="80px"
                className="object-cover"
                alt={`Thumbnail ${index + 1}`}
                loading="lazy"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <ZoomModal
        imageUrl={images[activeImageIndex]}
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
      />
    </div>
  );
};

export default ImageGallery;