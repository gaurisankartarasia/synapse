
export interface UserProfile {
    uid: string;
    username: string;
    isVerified:boolean;
    isPrivate:boolean;
    displayName:string;
    email: string;
    profilePhotoURL: string;
    followerCount:number;
    followingCount:number;
    bio?: string;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
  };    
  }
  




// types/profile.ts


export interface ProfileData {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  account_type: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
};    
  bio: string;
  isVerified: boolean;
  isPrivate:boolean;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isRequested: boolean;
  isFollowingWithoutFollowback:boolean;
  blocked?: boolean;

  media_count: number;
  viewer: {
    uid: string;
  }
}


export interface FollowUser {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isVerified: boolean;
}

export type FollowStatus = 'none' | 'following' | 'requested' | 'followBack' ;