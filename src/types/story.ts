// src/types/story.ts
export interface Story {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  username: string;
  profilePhotoURL: string;
}