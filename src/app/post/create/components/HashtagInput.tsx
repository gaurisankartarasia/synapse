// src/app/post/create/components/HashtagInput.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HashtagInputProps {
  onChange: (hashtags: string[]) => void;
}

export const HashtagInput = ({ onChange }: HashtagInputProps) => {

 const [hashtags, setHashtags] = useState<string[]>([]);

  // const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const hashtagInput = e.target.value;
  //   const newHashtags = hashtagInput
  //     .split(',')
  //     .map(tag => tag.trim().replace(/^#/, ''))
  //     .filter(tag => tag !== '');
  //   onChange(newHashtags);
  // };


  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagInput = e.target.value;
    // Split by comma, trim whitespace, remove empty strings, and remove # if added
    const newHashtags = hashtagInput
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag !== '');
    
    setHashtags(newHashtags);
  };

  return (
    // <div className="mb-4">
    //   <Input
    //     type="text"
    //     placeholder="Add hashtags (comma-separated, e.g., tech, programming)"
    //     onChange={handleHashtagChange}
    //   />
    // </div>
    <div className="mb-4">
    <Input
      type="text"
      placeholder="Add hashtags (comma-separated, e.g., tech, programming)"
      onChange={handleHashtagChange}
    />
    {hashtags.length > 0 && (
      <div className="flex gap-2 mb-2">
        {hashtags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
  </div>
    
  );
};