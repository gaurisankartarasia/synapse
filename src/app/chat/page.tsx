import React, { useState, useEffect, useCallback } from "react";
import { auth } from "../../lib/firebaseClient";

interface ChatWindowProps {
  targetUser: any; // Pass the target user's profile data here
}

const ChatWindow: React.FC<ChatWindowProps> = ({ targetUser }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMessages = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/chat/messages?userId=${targetUser.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [targetUser.uid]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/chat/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          recipientId: targetUser.uid,
          message: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh chat
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-window">
      {loading ? (
        <p>Loading chat...</p>
      ) : (
        <ul className="messages-list">
          {messages.map((msg, index) => (
            <li key={index} className={msg.isOwnMessage ? "own-message" : "received-message"}>
              <p>{msg.text}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={!newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
