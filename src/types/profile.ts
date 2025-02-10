
export interface UserProfile {
    uid: string;
    username: string;
    isVerified:boolean;
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
  