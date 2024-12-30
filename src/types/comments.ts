export type Comment = {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    authorId: string;
    likes: number;
    likedBy: string[];
  };


  export type Report = {
    commentId: string;
    reporterId: string;
    reason: string;
    createdAt: string;
    postId: string;
  };
  