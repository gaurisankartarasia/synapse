// app/inbox/page.tsx
import React from 'react';
import ConversationsList from './components/ConversationsList';
import { useAuth } from '@/hooks/useAuth';

export default function InboxPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please log in</div>;
  }

  return (
    <div className="flex h-screen">
      <ConversationsList userId={user.id} />
    </div>
  );
}