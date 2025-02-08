
export interface Comment {
  id: string;
  uid: string;
  user:{
    uid: string;
    username: string | "User";
    photoURL: string | "User";
    displayName: string | "User";
    is_verified: boolean | "...";
    is_private: boolean ;
  }
  content: string;
  created_at: {
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
    photoURL: string;
    displayName: string;
    is_verified: boolean;
    is_private: boolean;
  }
  content: string;
  created_at: {
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
  created_at: {
    _seconds: number;
    _nanoseconds: number;
  };
  postId: string;
};
