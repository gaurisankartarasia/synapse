
export type Post = {
  id: string;
  uid: string;
  title: string;
  imageURLs: string[];
  profilePhotoURL:string;
  displayName:string;
  content: string;
  author: string;
  isVerified:boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  like_count: number;
  allow_commenting: boolean,
  comment_count: number;
  hashtags?: string[];
  is_saved: boolean;
  is_liked:boolean;
};



export type ProfileData = {
  displayName: string;
  followerCount: number;
  followingCount: number;
  profilePhotoURL: string;
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