// types/story.ts
import { Timestamp } from 'firebase-admin/firestore';

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: Timestamp;
  expiresAt: Date;
  views: number;
}

export interface StoryResponse {
  success: boolean;
  storyId: string;
  url: string;
}

export interface StoryError {
  error: string;
}