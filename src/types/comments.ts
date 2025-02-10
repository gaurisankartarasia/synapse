
export interface Comment {
  id: string;
  uid: string;
  user:{
    uid: string;
    username: string | "User";
    profilePhotoURL: string | "User";
    displayName: string | "User";
    isVerified: boolean | "...";
    isPrivate: boolean ;
  }
  content: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  likes: number;
  likedBy: string[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  uid: string;
  user:{
    uid: string;
    username: string;
    profilePhotoURL: string;
    displayName: string;
    isVerified: boolean;
    isPrivate: boolean;
  }
  content: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  likes: number;
  likedBy: string[];
}

export type Report = {
  commentId: string;
  reporterId: string;
  reason: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  postId: string;
};
