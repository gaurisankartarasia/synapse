
"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useRouter } from 'next/navigation';
import { Message } from '@/types/chat';
import { CustomJWTPayload } from '@/types/auth';
import { Spinner } from '@/components/ui/spinner';

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const targetUserId = resolvedParams.userId;
  
  const [currentUser, setCurrentUser] = useState<CustomJWTPayload | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [userInfo, setUserInfo] = useState<{ 
    username: string, 
    profilePhotoURL: string, 
    displayName: string, 
    verified: string 
  } | null>(null);

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          router.push('/signin');
          return;
        }

        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.push('/signin');
      }
    }

    checkAuth();
  }, [router]);

  // Fetch user info
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch(`/api/user/${targetUserId}/mini`, {
          credentials: 'include'
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
    return <Spinner/>;
  }

  return (
    <>
      <header className="p-4 ">
        {userInfo && (
          <Link href={`/${userInfo.username}`} className='flex items-center'>
            <Image 
              src={userInfo.profilePhotoURL} 
              alt={`${userInfo.username}'s avatar`} 
              height={30} 
              width={30} 
              className="rounded-full mr-4" 
            />
            <h1 className="text-lg font-semibold">{userInfo.username}</h1>
            {userInfo.verified && (
              <span 
                className="material-symbols-outlined" 
                title='This user is verified'
              >
                verified
              </span>
            )}
          </Link>
        )}
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
          </>
        )}
      </div>
    </>
  );
}