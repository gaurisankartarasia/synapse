

// components/FollowRequest.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import { VscVerifiedFilled } from 'react-icons/vsc';
import { UserHoverCard } from '@/components/user-profile-hover-card';


interface User {
  uid: string;
  username: string;
  profilePhotoURL: string;
  displayName: string;
  isVerified:boolean;
  isPrivate?:boolean
}

interface FollowRequestProps {
  user: User;
  onActionComplete: () => void;
}

export const FollowRequest = ({ user, onActionComplete }: FollowRequestProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'accept' | 'reject') => {
    setIsLoading(true);
    try {
      
      const response = await fetch('/api/handle-follow-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          fromUid: user.uid,
          action
        })
      });

      if (!response.ok) {
        throw new Error('Failed to handle follow request');
      }

      onActionComplete();
    } catch (error) {
      console.error('Error handling follow request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    <div className="flex items-center justify-between p-4 border-b">
      <div >
      <div className="flex items-center space-x-4">
       
         <Avatar>
      <AvatarImage src={user.profilePhotoURL || '/profile-default-photo.svg'} alt={user.username} className='object-cover'/>
      <AvatarFallback>{user.username}</AvatarFallback>
    </Avatar>
        <div>
          <div className='flex items-center gap-1'>
          <UserHoverCard username={user.username} >
          <Link href={`/${user.username}`} className="flex items-center space-x-4"> 
              <p className="font-semibold hover:opacity-70">{user.username}</p>
              </Link>
         </UserHoverCard>
          <div>  {user.isVerified && <VscVerifiedFilled size={17}/> }</div>
          </div>
        
        
          <p className="text-sm t500">{user.displayName}</p>
        </div>
         </div>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => handleAction('accept')}
          disabled={isLoading}
        >
          Confirm
        </Button>
        <Button
          onClick={() => handleAction('reject')}
          disabled={isLoading}
          variant="outline"
        >
          Reject
        </Button>
      </div>
    </div>
    </div>
  );
};


