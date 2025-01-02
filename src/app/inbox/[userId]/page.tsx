

"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useRouter } from 'next/navigation';
import { Message } from '@/types/chat';
import { CircularProgress } from '@mui/material';

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [userInfo, setUserInfo] = useState<{ username: string, photoURL: string, displayName: string, verified:string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setUserId(resolvedParams.userId);
    });
  }, [params]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (userId) {
      async function fetchUserInfo() {
        try {
          const response = await fetch(`/api/user/${userId}/mini`);
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
            document.title = `Inbox - ${data.username}`; 
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
      }
      fetchUserInfo();
    }
  }, [userId]);

  const handleReply = (message: Message) => {
    setEditingMessage(null); // Clear any editing state
    setReplyingTo(message);
  };

  const handleEdit = (message: Message) => {
    setReplyingTo(null); // Clear any reply state
    setEditingMessage(message);
  };

  const handleCancelAction = () => {
    setReplyingTo(null);
    setEditingMessage(null);
  };

  if (authLoading) {
    return  <CircularProgress className='flex justify-center' />;
  }

  return (
    <>
    <header className=" p-4 bg-gray-100">
    {userInfo && (
      <>
       <Link href={`/${userInfo.username}`} className='flex items-center'>
       <Image src={userInfo.photoURL} alt={`${userInfo.username}'s avatar`} height={30} width={30} className="rounded-full mr-4" />
    
          <h1 className="text-lg font-semibold">{userInfo.username}</h1>
          {userInfo.verified && <span className="material-symbols-outlined" title='This user is verified'>
verified
</span>}
        </Link>
     
      </>
    )}
  </header>
  
    <div className="flex justify-center w-full">
   
      {userId && (
      <>
          <ChatMessages 
            userId={userId}
            onReply={handleReply}
            onEdit={handleEdit}
            replyingTo={replyingTo}
            editingMessage={editingMessage}
          />
          <ChatInput 
            userId={userId}
            replyingTo={replyingTo}
            editingMessage={editingMessage}
            onCancelAction={handleCancelAction}
          />
        
        </>
      )  }
    </div>
    </>
  );
}