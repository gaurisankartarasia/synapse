// types/post.ts
export interface Post {
    id: string;
    uid: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    imageUrls: string[];
  }
  