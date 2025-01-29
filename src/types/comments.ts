
// export interface Comment {
//   id: string;
//   authorId: string;
//   author: string;
//   content: string;
//   createdAt: {
//     _seconds: number;
//     _nanoseconds: number;
//   };
//   likes: number;
//   likedBy: string[];
//   replies: Reply[];

// }
 
//    export interface Reply {
//   id: string;
//   authorId: string;
//   author: string;
//   content: string;
//   createdAt: string;
//   likes: number;
//   likedBy: string[];
// }

// types/comments.ts
export interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  replyCount: number;
  isEdited: boolean;
  lastEditedAt: Date | null;
  hasLiked: boolean;
  replies: Reply[];
  username:string
}

export interface Reply {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  isEdited: boolean;
  lastEditedAt: Date | null;
  hasLiked: boolean;
}


  export type Report = {
    commentId: string;
    reporterId: string;
    reason: string;
    createdAt: string;
    postId: string;
  };
  