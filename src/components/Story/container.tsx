// src/components/StoriesContainer.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { StoryCircle } from './circle';
import { StoryViewer } from './view';
import { Story } from '@/types/story';
import { Spinner } from '../ui/spinner';

export default function StoriesContainer() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  
  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      
      const data = await response.json();
      
      // Convert date strings to Date objects
      const formattedStories = data.stories.map((story: any) => ({
        ...story,
        createdAt: story.createdAt ? new Date(story.createdAt) : null,
        updatedAt: story.updatedAt ? new Date(story.updatedAt) : null,
      }));
      
      setStories(formattedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
     
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStories();
  }, []);
  
  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };
  
  const handleCloseViewer = () => {
    setSelectedStoryIndex(null);
  };


   // Group stories by user
   const groupedStories = useMemo(() => {
    const groups = new Map<string, Story[]>();
    stories.forEach(story => {
      if (!groups.has(story.userId)) {
        groups.set(story.userId, []);
      }
      groups.get(story.userId)?.push(story);
    });
    return Array.from(groups.values());
  }, [stories]);


  
  if (isLoading) {
    return (
      <Spinner/>
    );
  }
  
  if (stories.length === 0) {
    return (
      null
    );
  }
  
  return (
    <div className="my-4">
      <div className="flex overflow-x-auto gap-4 pb-2 px-4 -mx-4">
        {groupedStories.map((userStories) => (
          <StoryCircle
            key={userStories[0].userId}
            story={userStories[0]}
            onClick={() => handleStoryClick(stories.indexOf(userStories[0]))}
          />
        ))}
      </div>
      
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialStoryIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
          onStoryEnd={(index) => {
            // Handle story end without causing state updates during render
            setTimeout(() => {
              if (index === stories.length - 1) {
                handleCloseViewer();
              }
            }, 0);
          }}
        />
      )}
    </div>
  );
}