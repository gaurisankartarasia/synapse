// components/ImageZoom/ZoomModal.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import {Button} from '@mui/material'

interface ZoomModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ZoomModal: React.FC<ZoomModalProps> = ({ imageUrl, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleModalClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Close button */}
        <Button 
          className="absolute top-4 right-4 text-white z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          onClick={handleModalClose}
        >
          ✕
        </Button>

        {/* Zoom controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          <Button 
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
            onClick={handleZoomOut}
            disabled={scale <= 1}
          >
            −
          </Button>
          <Button 
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            +
          </Button>
        </div>

        {/* Zoomed Image */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'transform 0.2s',
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative"
        >
          <Image
            src={imageUrl}
            width={1200}
            height={800}
            className="max-w-none"
            alt="Zoomed image"
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ZoomModal;