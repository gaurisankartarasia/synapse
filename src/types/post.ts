
export type Post = {
  id: string;
  uid: string;
  title: string;
  imageUrls: string[];
  photoURL:string;
  displayName:string;
  content: string;
  author: string;
  is_verified:boolean;
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  likeCount: number;
  allowCommenting: boolean,
  commentCount: number;
  hashtags?: string[];
  is_saved: boolean;
  is_liked:boolean;
};



export type ProfileData = {
  displayName: string;
  followersCount: number;
  followingCount: number;
  photoURL: string;
  private: boolean;
  username: string;
  verified: boolean;
  uid: string;
  isFollowing?: boolean;
  isRequested?: boolean;
};

export type Author = {
    id: string;
    username: string;
    profileImage: string;
  };