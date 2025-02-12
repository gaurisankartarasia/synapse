// components/UserSuggestions.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from '@/types/user';
import { BadgeCheck } from 'lucide-react';


export default function UserSuggestions() {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('/api/user/suggested');
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (uid: string) => {
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUid: uid }),
      });

      if (response.ok) {
        setSuggestions(prev =>
          prev.map(user =>
            user.uid === uid ? { ...user, isFollowing: true } : user
          )
        );
      }
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-sm p-4">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-sm p-4">
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-sm border-l-2 ">
        <h3 className="font-semibold mb-4">Suggested for you</h3>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div key={user.uid} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={user.profilePhotoURL || "/profile-default-photo.svg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className='flex'>
                  <p className="font-medium text-sm">{user.username}</p>
                  {user.isVerified && <BadgeCheck size={15}/> }
                  </div>
                  <p className="text-gray-500 text-xs">{user.displayName}</p>
                </div>
              </div>
              <Button
                variant={user.isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={() => handleFollow(user.uid)}
                disabled={user.isFollowing}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
        </div>
    </div>
  );
}