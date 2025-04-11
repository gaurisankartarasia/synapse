
import React, { useState, useCallback, useEffect } from 'react';
import {useAuth} from '@/hooks/useAuth'
import { Avatar } from '@mui/material';
import Link from 'next/link';

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
    <div className=" flex justify-center text-xs">
      <div>
        {loading ? (
          null
        ) : mutualFollowers.length > 0 ? (
          <div className="flex items-center text-xs">
            <p>Followed by</p>
            {mutualFollowers.slice(0, 2).map((follower) => (
              <div
                key={follower.uid}
                className="flex items-center space-x-1 p-2 rounded-md"
              >              
                <Avatar src={follower.profilePhotoURL} alt={follower.username} sx={{ width: 24, height: 24 }} >
                
                    {follower.username.slice(0,2)}
                </Avatar>
                <Link href={`/${follower.username}`} className="text-xs font-semibold truncate">
                  {follower.username}
                </Link>
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

