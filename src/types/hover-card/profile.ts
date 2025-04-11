export interface UserProfile {
    uid: string;
    username: string;
    displayName: string;
    profilePhotoURL: string;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    followerCount: number;
    followingCount: number;
    isVerified: boolean;
    isPrivate: boolean;
    isFollowing?: boolean;
    isRequested?: boolean;
    isFollowingWithoutFollowback?: boolean;
  }
  