// export type Comment = {
//     id: string;
//     content: string;
//     author: string;
//     createdAt: string;
//     authorId: string;
//     likes: number;
//     likedBy: string[];
//   };
// types/comments.ts
export interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}


  export type Report = {
    commentId: string;
    reporterId: string;
    reason: string;
    createdAt: string;
    postId: string;
  };
  