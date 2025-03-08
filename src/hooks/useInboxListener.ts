import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; // Ensure you have an AuthContext

interface InboxItem {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCounts: Record<string, number>;
}

export function useInboxListener() {
  const { user } = useAuth();
  const [inboxes, setInboxes] = useState<InboxItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const inboxQuery = query(
      collection(db, "chatRooms"),
      where("participants", "array-contains", user.uid),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(inboxQuery, (snapshot) => {
      const updatedInboxes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InboxItem[];

      setInboxes(updatedInboxes);
    });

    return () => unsubscribe();
  }, [user]);

  return { inboxes };
}
