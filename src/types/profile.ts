
export interface UserProfile {
    uid: string;
    username: string;
    is_verified:boolean;
    displayName:string;
    email: string;
    photoURL: string;
    followersCount:number;
    followingCount:number;
    bio?: string;
    created_at: {
      _seconds: number;
      _nanoseconds: number;
  };    
  }
  