
export type Post = {
  id: string;
  uid: string;
  title: string;
  imageURLs: string[];
  profilePhotoURL:string;
  displayName:string;
  content: string;
  username: string;
  isVerified:boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  likeCount: number;
  allowCommenting: boolean,
  commentCount: number;
  hashtags?: string[];
  isSaved: boolean;
  isLiked:boolean;
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