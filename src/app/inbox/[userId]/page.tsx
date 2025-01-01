
"use client";
import { useAuth } from '@/hooks/useAuth';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { use } from 'react';

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Unwrap the params object
  const { userId } = use(params);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center w-full">
      <ChatMessages userId={userId}  />
      <ChatInput userId={userId} />
    </div>
  );
}