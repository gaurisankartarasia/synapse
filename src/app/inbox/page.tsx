// src/app/inbox/page.tsx
'use client';

import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import useSWR from 'swr';
import { useEffect } from 'react';

interface Chat {
  id: string;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  isRead: boolean;
}

const fetcher = (url: string) => 
  axios.get(url, { withCredentials: true }).then(res => res.data);

export default function InboxPage() {
  const { data: chats, error, mutate } = useSWR<Chat[]>(
    '/api/inbox',
    fetcher,
    { refreshInterval: 3000 }
  );

  const markAsRead = async (userId: string) => {
    try {
      await axios.post(`/api/inbox/${userId}/read`, {}, {
        withCredentials: true
      });
      mutate();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (error) return <div>Failed to load chats</div>;
  if (!chats) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chats</h1>
      <div className="space-y-3">
        {chats.map(chat => (
          <Link
            key={chat.id}
            href={`/chat/${chat.otherParticipant.id}`}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            onClick={() => markAsRead(chat.otherParticipant.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={chat.otherParticipant.avatar || '/default-avatar.png'}
                  alt={chat.otherParticipant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {chat.otherParticipant.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <time className="text-xs text-gray-500 block mb-1">
                  {format(new Date(chat.lastMessageTimestamp), 'HH:mm')}
                </time>
                {!chat.isRead && chat.unreadCount > 0 && (
                  <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}