
export type Post = {
  id: string;
  uid: string;
  title: string;
  imageUrls: string[];
  photoURL:string;
  displayName:string;
  content: string;
  author: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  likes: number;
  authorId: string;
  commentCount: number;
  hashtags?: string[];
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
    duration?: number;
  }[];
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