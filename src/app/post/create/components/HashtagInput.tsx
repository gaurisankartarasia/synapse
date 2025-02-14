// src/app/post/create/components/HashtagInput.tsx
import { Input } from "@/components/ui/input";

interface HashtagInputProps {
  onChange: (hashtags: string[]) => void;
}

export const HashtagInput = ({ onChange }: HashtagInputProps) => {
  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagInput = e.target.value;
    const newHashtags = hashtagInput
      .split(',')
      .map(tag => tag.trim().replace(/^#/, ''))
      .filter(tag => tag !== '');
    onChange(newHashtags);
  };

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Add hashtags (comma-separated, e.g., tech, programming)"
        onChange={handleHashtagChange}
      />
    </div>
  );
};