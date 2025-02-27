
import React, { useState, useCallback, useEffect } from 'react';
// import { auth } from "@/lib/firebaseClient";
import {useAuth} from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MutualFollower {
  uid: string;
  username: string;
  displayName?: string;
  profilePhotoURL?: string;
  isVerified: boolean;
}

interface MutualFollowersProps {
  username: string;
  onUserClick?: (username: string) => void;
}

const MutualFollowers: React.FC<MutualFollowersProps> = ({ username, onUserClick }) => {
  const {user} = useAuth()
  const [mutualFollowers, setMutualFollowers] = useState<MutualFollower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMutualFollowers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // const token = await auth.currentUser?.getIdToken();
      
      if (!user) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`/api/mutual-followers?username=${username}`, {
       credentials:"include"
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setMutualFollowers(data.mutualFollowers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mutual followers');
    } finally {
      setLoading(false);
    }
  }, [user, username]);

  useEffect(() => {
    fetchMutualFollowers();
  }, [fetchMutualFollowers]);

  if (error) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <div>
        {loading ? (
          null
        ) : mutualFollowers.length > 0 ? (
          <div className="flex items-center">
            <p>Followed by</p>
            {mutualFollowers.slice(0, 2).map((follower) => (
              <div
                key={follower.uid}
                className="flex items-center space-x-1 p-2 rounded-md"
                onClick={() => onUserClick?.(follower.username)}
              >              
                <Avatar className='h-6 w-6 cursor-pointer'>
                  <AvatarImage src={follower.profilePhotoURL} className='object-cover' />
                  <AvatarFallback>
                    {follower.username.slice(0,2)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold truncate cursor-pointer hover:underline">
                  {follower.username}
                </p>
              </div>
            ))}
           
            {mutualFollowers.length > 2 && (
              <p className="text-sm font-semibold ml-2">and +{mutualFollowers.length - 2} more</p>
            )}
          </div>
        ) : (
          null
        )}
      </div>
    </div>
  );
};

export default MutualFollowers;




