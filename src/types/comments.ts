// export interface Comment {
//   id: string;
//   authorId: string;
//   author: string;
//   content: string;
//   createdAt: string;
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

//   export type Report = {
//     commentId: string;
//     reporterId: string;
//     reason: string;
//     createdAt: string;
//     postId: string;
//   };


export interface Comment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  replies: Reply[];
}

export interface Reply {
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
