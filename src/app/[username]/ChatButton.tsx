
// components/profile/ChatButton.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatButtonProps {
  targetUserId: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ targetUserId }) => {
  const router = useRouter();

  const startChat = () => {
    router.push(`/inbox/${targetUserId}`);
  };

  return (
    
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
        className='w-24'
      onClick={startChat}
      variant="outline"
    >
      Message
    </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Message to this user</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};