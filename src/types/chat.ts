


export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
  time: string;
  date: string;
  read: boolean;
  roomId?: string;
  //for replying a perticular message 
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
  };
  //for editiing a perticular message shit why am i so noob to write this 
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
}
