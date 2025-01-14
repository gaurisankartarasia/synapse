// src/types/chat.ts
export interface Message {
    content: string;
    timestamp: number;
    senderId: string;
  }
  
  export interface ChatRoom {
    id: string;
    participants: string[];
    participantKey: string;
    lastMessage: Message | null;
    otherUser: {
      displayName: string;
      uid?: string;
    };
  }
  
  export interface ChatRoomResponse {
    chatRooms: ChatRoom[];
  }