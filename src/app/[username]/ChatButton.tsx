// components/profile/ChatButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface ChatButtonProps {
  targetUserId: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ targetUserId }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/inbox/${targetUserId}`}>
            <Button variant="outline">Message</Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Message to this user</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
