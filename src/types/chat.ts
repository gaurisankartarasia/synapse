


export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  time: string;
  date: string;
  read: boolean;
  roomId?: string;
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
  };
  edited?: {
    timestamp: number;
    time: string;
  };
  deletedForEveryone?: boolean;
  deletedFor?: string[];
  readBy:string
  sent:string
}

export interface ChatMessagesProps {
  userId: string;
  currentUserId:string;
  user: {
    uid: string;
    getIdToken: () => Promise<string>;
  } | null;
}


export interface ChatRoom {
  id: string;
  participants: string[];
  participantKey: string;
  lastMessage?: Message;
  createdAt: number;
  toDate: number;
  otherUser: {
    displayName: string;
    uid?: string;
  };
}
