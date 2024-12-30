export type Author = {
    id: string;
    username: string;
    profileImage: string;
  };
  
  export type Post = {
    id: string;
    title: string;
    imageUrls: string[];
    content: string;
    author: Author;
    createdAt: string;
    likes: number;
  };
  