// // components/ImageZoom/ZoomModal.tsx
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { IconButton } from '@mui/material';
// import { Close } from '@mui/icons-material';

// interface ZoomModalProps {
//   imageURL: string;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ZoomModal: React.FC<ZoomModalProps> = ({ imageURL, isOpen, onClose }) => {
//   const [scale, setScale] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

//   if (!isOpen) return null;

//   const handleZoomIn = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setScale(prev => Math.min(prev + 0.5, 3));
//   };

//   const handleZoomOut = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setScale(prev => Math.max(prev - 0.5, 1));
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (scale > 1) {
//       setIsDragging(true);
//       setDragStart({
//         x: e.clientX - position.x,
//         y: e.clientY - position.y
//       });
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (isDragging && scale > 1) {
//       setPosition({
//         x: e.clientX - dragStart.x,
//         y: e.clientY - dragStart.y
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleModalClose = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setScale(1);
//     setPosition({ x: 0, y: 0 });
//     onClose();
//   };

//   return (
//     <div 
//       className="fixed inset-0 bg-black/30 bg-opacity-90 z-50 flex items-center justify-center"
//       onClick={handleModalClose}
//     >
//       <div 
//         className="relative w-full h-full flex items-center justify-center overflow-hidden"
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//       >
//         {/* Close IconButton */}
//         <IconButton 
//         sx={{position:'absolute', top:'0px', right:"10px"}}
//           onClick={handleModalClose}
//         >
//           <Close/>
//         </IconButton>

//         {/* Zoom controls */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
//           <IconButton 
//             className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
//             onClick={handleZoomOut}
//             disabled={scale <= 1}
//           >
//             −
//           </IconButton>
//           <IconButton 
//             className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100"
//             onClick={handleZoomIn}
//             disabled={scale >= 3}
//           >
//             +
//           </IconButton>
//         </div>

//         {/* Zoomed Image */}
//         <div
//           style={{
//             transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
//             cursor: isDragging ? 'grabbing' : 'grab',
//             transition: isDragging ? 'none' : 'transform 0.2s',
//           }}
//           onClick={(e) => e.stopPropagation()}
//           className="relative"
//         >
//           <Image
//             src={imageURL}
//             width={1200}
//             height={800}
//             className="max-w-none"
//             alt="Zoomed image"
//             quality={100}
//             priority
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ZoomModal;










// components/ImageZoom/ZoomModal.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ZoomModalProps {
  imageURL: string;
  isOpen: boolean;
  onClose: () => void;
}

const ZoomModal: React.FC<ZoomModalProps> = ({ imageURL, isOpen, onClose }) => {
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

  // Define common styles for the zoom buttons using sx
  const zoomButtonSx = {
    backgroundColor: '#ffffff', // Equivalent to bg-white
    color: '#000000',         // Equivalent to text-black
    paddingX: '1rem',          // Equivalent to px-4
    paddingY: '0.5rem',        // Equivalent to py-2
    borderRadius: '0.25rem',   // Equivalent to rounded
    '&:hover': {
      backgroundColor: '#f3f4f6', // Equivalent to hover:bg-gray-100 (Tailwind gray-100)
    },
    // MUI handles disabled state styling by default, 
    // but you could add custom disabled styles here if needed:
    // '&.Mui-disabled': { 
    //   backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    //   color: 'rgba(0, 0, 0, 0.4)' 
    // }
  };

  return (
    <div 
      // Using Tailwind for modal background/layout is fine
      className="fixed inset-0 bg-black/30 bg-opacity-90 z-50 flex items-center justify-center" 
      onClick={handleModalClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Close IconButton - Already using sx */}
        <IconButton 
          sx={{ position: 'absolute', top: '10px', right: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }} 
          onClick={handleModalClose}
        >
          <Close />
        </IconButton>

        {/* Zoom controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
          <IconButton 
            sx={zoomButtonSx} // Apply sx styles
            onClick={handleZoomOut}
            disabled={scale <= 1}
          >
            −
          </IconButton>
          <IconButton 
            sx={zoomButtonSx} // Apply sx styles
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            +
          </IconButton>
        </div>

        {/* Zoomed Image */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'grab',
            transition: isDragging ? 'none' : 'transform 0.2s',
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative" // Keeping Tailwind here is okay
        >
          <Image
            src={imageURL}
            width={1200}
            height={800}
            className="max-w-none" // Keeping Tailwind here is okay
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