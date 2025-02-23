// src/components/StoryCircle.tsx
import React from 'react';
import Image from 'next/image';
import { Story } from '@/types/story';

interface StoryCircleProps {
  story: Story;
  onClick: () => void;
}

export function StoryCircle({ story, onClick }: StoryCircleProps) {
  return (
    <div 
      className="flex flex-col items-center space-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-md p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-500">
        <div className="w-full h-full rounded-md p-[2px] bg-white">
          <div className="relative w-full h-full rounded-md overflow-hidden">
            <Image
              src={story.imageUrl}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-700 truncate max-w-[70px] text-center">
        {story.username}
      </span>
    </div>
  );
}