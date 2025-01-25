
export interface UserProfile {
    uid: string;
    username: string;
    displayName:string;
    email: string;
    photoURL: string;
    followersCount:number;
    followingCount:number;
    bio?: string;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
  };    
  }
  