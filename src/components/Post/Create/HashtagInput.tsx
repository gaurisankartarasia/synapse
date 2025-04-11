// src/app/post/create/components/HashtagInput.tsx
import { useState } from "react";
import TextField from "@mui/material/TextField";

interface HashtagInputProps {
  onChange: (hashtags: string[]) => void;
}

export const HashtagInput = ({ onChange }: HashtagInputProps) => {

 const [hashtags, setHashtags] = useState<string[]>([]);


  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagInput = e.target.value;
    const newHashtags = hashtagInput
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag !== '');
  
    setHashtags(newHashtags);
    onChange(newHashtags); // Ensure hashtags are passed back to PostPage
  };
  

  return (
    <div className="mb-4 ">
    <TextField
    sx={{width:'100%'}}
      type="text"
      placeholder="Add hashtags (comma-separated, e.g., tech, programming)"
      onChange={handleHashtagChange}
    />
    {hashtags.length > 0 && (
      <div className="flex gap-2 mb-2">
        {hashtags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
  </div>
    
  );
};