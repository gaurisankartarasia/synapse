import { User } from 'firebase/auth';

// export interface Message {
//   id: string;
//   roomId:string;
//   content: string;
//   senderId: string;
//   timestamp: number;
//   time?: string;
//   date: string;
//   read: boolean;
//   toDate: number;
// }


// export interface ChatMessagesProps {
//   userId: string;
//   // user: { uid: string } | null;
//   user: User | null;
//   toDate: number;
// }




export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
  time: string;
  date: string;
  read: boolean;
  roomId?: string;
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
