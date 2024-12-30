import { Timestamp } from 'firebase-admin/firestore';

export interface LikeUser {
  uid: string;
  username: string;
  profilePic: string;
  timestamp: Timestamp;
}

export interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export interface LikeUserResponse {
  uid: string;
  username: string;
  profilePic: string;
  timestamp: string; // ISO string from the API
}
