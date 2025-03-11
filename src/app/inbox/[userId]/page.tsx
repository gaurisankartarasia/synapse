//src/app/inbox/[userId]/page.tsx
"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useRouter } from "next/navigation";
import { Message } from "@/types/chat";
import { CustomJWTPayload } from "@/types/auth";
import { Spinner } from "@/components/ui/spinner";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportModal } from "@/components/ReportModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const targetUserId = resolvedParams.userId;

  const [currentUser, setCurrentUser] = useState<CustomJWTPayload | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    profilePhotoURL: string;
    displayName: string;
    isVerified: string;
  } | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/signin");
          return;
        }

        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/signin");
      }
    }

    checkAuth();
  }, [router]);

  // Fetch user info
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch(`/api/user/${targetUserId}/mini`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          document.title = `Inbox - ${data.username}`;
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }

    if (targetUserId) {
      fetchUserInfo();
    }
  }, [targetUserId]);

  const handleReport = async (reason: string) => {
    try {
      const response = await fetch(`/api/report/user_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reported_uid: targetUserId,
          reason,
          report_type: "profile",
        }),
      });

      if (response.ok) {
        alert("Profile reported successfully");
        setIsReportModalOpen(false);
      } else {
        console.error("Failed to report profile");
      }
    } catch (error) {
      console.error("Error reporting profile:", error);
    }
  };

  const handleReply = (message: Message) => {
    setEditingMessage(null);
    setReplyingTo(message);
  };

  const handleEdit = (message: Message) => {
    setReplyingTo(null);
    setEditingMessage(message);
  };

  const handleCancelAction = () => {
    setReplyingTo(null);
    setEditingMessage(null);
  };

  if (!currentUser || !targetUserId) {
    return <Spinner />;
  }

  return (
    <>
      <header className="p-4 ">
        <section className="flex justify-between">
          {userInfo && (
            <Link
              href={`/${userInfo.username}`}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage
                  src={userInfo.profilePhotoURL}
                  alt={`${userInfo.username}'s avatar`}
                  className="object-cover"
                />
                <AvatarFallback>{userInfo.username.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-semibold">{userInfo.username}</h1>
              {userInfo.isVerified && <VscVerifiedFilled size={20} className=" text-blue-500" />}
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                {" "}
                <EllipsisVertical size={15} />{" "}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsReportModalOpen(true)}>
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </header>

      <div className="flex justify-center w-full">
        {currentUser && (
          <>
            <ChatMessages
              userId={targetUserId}
              onReply={handleReply}
              onEdit={handleEdit}
              replyingTo={replyingTo}
              editingMessage={editingMessage}
              currentUserId={currentUser.uid}
            />

            <ChatInput
              userId={targetUserId}
              replyingTo={replyingTo}
              editingMessage={editingMessage}
              onCancelAction={handleCancelAction}
            />
            <ReportModal
              type="profile"
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              onSubmit={handleReport}
            />
          </>
        )}
      </div>
    </>
  );
}
