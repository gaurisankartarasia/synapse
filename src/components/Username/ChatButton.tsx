


"use client";
import { Button, Tooltip } from "@mui/material";
import Link from "next/link";

interface ChatButtonProps {
  targetUserId: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ targetUserId }) => {
  return (
    <Tooltip title="Message this user">
      <Link href={`/inbox/${targetUserId}`} style={{ textDecoration: 'none' }}>
        <Button variant="outlined">Message</Button>
      </Link>
    </Tooltip>
  );
};