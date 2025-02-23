// // src/components/StoryViewer.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronLeft, ChevronRight, X, Pause, Play } from 'lucide-react';
// import Image from 'next/image';
// import { formatDistanceToNow } from 'date-fns';
// import { Story } from '@/types/story';

// interface StoryViewerProps {
//   stories: Story[];
//   initialStoryIndex: number;
//   onClose: () => void;
// }

// export function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
//   const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
//   const [isPaused, setIsPaused] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const progressInterval = useRef<NodeJS.Timeout | null>(null);
//   const currentStory = stories[currentIndex];
  
//   const STORY_DURATION = 5000; // 5 seconds per story
  
//   useEffect(() => {
//     startProgress();
//     return () => {
//       if (progressInterval.current) {
//         clearInterval(progressInterval.current);
//       }
//     };
//   }, [currentIndex, isPaused]);
  
//   const startProgress = () => {
//     setProgress(0);
//     if (progressInterval.current) {
//       clearInterval(progressInterval.current);
//     }
    
//     if (!isPaused) {
//       const interval = 100; // Update progress every 100ms
//       progressInterval.current = setInterval(() => {
//         setProgress(prev => {
//           const newProgress = prev + (100 * interval / STORY_DURATION);
//           if (newProgress >= 100) {
//             goToNextStory();
//             return 0;
//           }
//           return newProgress;
//         });
//       }, interval);
//     }
//   };
  
//   const goToPreviousStory = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(prev => prev - 1);
//     }
//   };
  
//   const goToNextStory = () => {
//     if (currentIndex < stories.length - 1) {
//       setCurrentIndex(prev => prev + 1);
//     } else {
//       onClose();
//     }
//   };
  
//   const togglePause = () => {
//     setIsPaused(prev => !prev);
//   };
  
//   if (!currentStory) return null;
  
//   return (
//     <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
//       <div className="relative w-full max-w-3xl h-full max-h-[90vh]">
//         {/* Close button */}
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 text-white p-2 rounded-md bg-black/20 hover:bg-black/40"
//         >
//           <X size={24} />
//         </button>
        
//         {/* Progress bars */}
//         <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
//           {stories.map((_, i) => (
//             <div key={i} className="h-1 bg-white/30 flex-1 rounded-md overflow-hidden">
//               {i === currentIndex && (
//                 <div 
//                   className="h-full bg-white" 
//                   style={{ width: `${progress}%` }}
//                 />
//               )}
//               {i < currentIndex && (
//                 <div className="h-full bg-white w-full" />
//               )}
//             </div>
//           ))}
//         </div>
        
//         {/* Story content */}
//         <div className="w-full h-full relative overflow-hidden">
//           <Image
//             src={currentStory.imageUrl}
//             alt={currentStory.title}
//             fill
//             className="object-cover"
//           />
          
//           {/* Story metadata */}
//           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
//             <h3 className="text-xl font-semibold mb-1">{currentStory.title}</h3>
//             {currentStory.description && (
//               <p className="text-sm text-white/90 mb-2">{currentStory.description}</p>
//             )}
//             {currentStory.createdAt && (
//               <p className="text-xs text-white/70">
//                 {formatDistanceToNow(currentStory.createdAt, { addSuffix: true })}
//               </p>
//             )}
//           </div>
          
//           {/* Navigation controls */}
//           <button
//             onClick={goToPreviousStory}
//             disabled={currentIndex === 0}
//             className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-md bg-black/20 hover:bg-black/40 disabled:opacity-0"
//           >
//             <ChevronLeft size={24} className="text-white" />
//           </button>
          
//           <button
//             onClick={goToNextStory}
//             disabled={currentIndex === stories.length - 1}
//             className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-md bg-black/20 hover:bg-black/40 disabled:opacity-0"
//           >
//             <ChevronRight size={24} className="text-white" />
//           </button>
          
//           {/* Pause/Play button */}
//           <button
//             onClick={togglePause}
//             className="absolute bottom-20 right-4 p-2 rounded-md bg-black/30 hover:bg-black/50"
//           >
//             {isPaused ? (
//               <Play size={20} className="text-white" />
//             ) : (
//               <Pause size={20} className="text-white" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/components/StoryViewer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Story } from '@/types/story';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onStoryEnd?: (index: number) => void;
}

export function StoryViewer({ stories, initialStoryIndex, onClose, onStoryEnd }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const currentStory = stories[currentIndex];
  
  const STORY_DURATION = 5000;
  
  const goToNextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onStoryEnd?.(currentIndex);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose, onStoryEnd]);
  
  useEffect(() => {
    if (!isPaused) {
      const interval = 100;
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 * interval / STORY_DURATION);
          if (newProgress >= 100) {
            goToNextStory();
            return 0;
          }
          return newProgress;
        });
      }, interval);
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, goToNextStory]);
  
  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };
  
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  if (!currentStory) return null;
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-3xl h-full max-h-[90vh]">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white p-2 rounded-md bg-black/20 hover:bg-black/40"
        >
          <X size={24} />
        </button>
        
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
          {stories.map((_, i) => (
            <div key={i} className="h-1 bg-white/30 flex-1 rounded-md overflow-hidden">
              {i === currentIndex && (
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${progress}%` }}
                />
              )}
              {i < currentIndex && (
                <div className="h-full bg-white w-full" />
              )}
            </div>
          ))}
        </div>
        
        {/* Story content */}
        <div className="w-full h-full relative overflow-hidden">
          <Image
            src={currentStory.imageUrl}
            alt={currentStory.title}
            fill
            className="object-cover"
          />
          
          {/* Story metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h3 className="text-xl font-semibold mb-1">{currentStory.title}</h3>
            {currentStory.createdAt && formatDistanceToNow(currentStory.createdAt, { addSuffix: true })}

            {currentStory.description && (
          <p className="text-sm text-white/90">{currentStory.description}</p>
        )}
          </div>
          
          {/* Navigation controls */}
          <button
            onClick={goToPreviousStory}
            disabled={currentIndex === 0}
            className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-md bg-black/20 hover:bg-black/40 disabled:opacity-0"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <button
            onClick={goToNextStory}
            disabled={currentIndex === stories.length - 1}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-md bg-black/20 hover:bg-black/40 disabled:opacity-0"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
          
          {/* Pause/Play button */}
          <button
            onClick={togglePause}
            className="absolute bottom-20 right-4 p-2 rounded-md bg-black/30 hover:bg-black/50"
          >
            {isPaused ? (
              <Play size={20} className="text-white" />
            ) : (
              <Pause size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


