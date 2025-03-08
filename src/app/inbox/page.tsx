// "use client";

// import { useInboxListener } from "@/hooks/useInboxListener";
// import Link
//  from "next/link";
// export default function InboxList() {
//   const { inboxes } = useInboxListener();

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold">Inbox</h2>
//       <ul>
//         {inboxes.map((inbox) => (
//           <li key={inbox.id} className="p-3 border-b">
//             <Link href={`/inbox/${inbox.id}`}  >
//             <p className="font-semibold">{inbox.lastMessage}</p>
//             <p className="text-sm text-gray-500">
//               Unread: {inbox.unreadCounts[inbox.participants[0]] || 0}
//             </p>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }







// app/components/InboxList.tsx
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseClient'; // Assuming you have firebaseClient setup
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an AuthContext

interface ChatRoom {
  id: string;
  participants: string[];
  participantKey: string;
  createdAt: any; // Firebase Timestamp
  lastMessage: string;
  lastMessageTime: any; // Firebase Timestamp
  unreadCounts: { [userId: string]: number };
}

interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  // Add other profile fields as needed
}

export default function InboxList() {
  const { user } = useAuth();
  const [inboxes, setInboxes] = useState<ChatRoom[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [uid: string]: UserProfile }>({});

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedInboxes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatRoom[];

      setInboxes(fetchedInboxes);
      fetchUserProfiles(fetchedInboxes);
    });

    return () => unsubscribe();
  }, [user?.uid,]);

  const fetchUserProfiles = async (inboxes: ChatRoom[]) => {
    const profilePromises: Promise<UserProfile | null>[] = [];
    const profileMap: { [uid: string]: UserProfile } = {};

    inboxes.forEach((inbox) => {
      inbox.participants.forEach((participantId) => {
        if (participantId !== user?.uid && !profileMap[participantId]) {
          profilePromises.push(
            getDoc(doc(db, 'users', participantId))
              .then((doc) => {
                if (doc.exists()) {
                  const data = doc.data();
                  return {
                    uid: doc.id,
                    displayName: data.displayName || 'Unknown',
                    photoURL: data.profilePhotoURL || '/default-avatar.png',
                    // Add other profile fields as needed
                  };
                } else {
                  return null;
                }
              })
              .catch(() => null)
          );
        }
      });
    });

    const fetchedProfiles = await Promise.all(profilePromises);
    fetchedProfiles.forEach((profile) => {
      if (profile) {
        profileMap[profile.uid] = profile;
      }
    });
    setUserProfiles(profileMap);
  };

  const getOtherParticipant = (participants: string[]) => {
    return participants.find((participantId) => participantId !== user?.uid);
  };

  if (!user) {
    return <div>Loading or not logged in</div>;
  }

  return (
    <div>
      <h2>Inboxes</h2>
      <ul>
        {inboxes.map((inbox) => {
          const otherParticipantId = getOtherParticipant(inbox.participants);
          const otherParticipantProfile = userProfiles[otherParticipantId || ''];

          return (
            <li key={inbox.id}>
              {otherParticipantProfile ? (
                <>
                <a href={`/inbox/${otherParticipantProfile.uid}`}>
                  <img
                    src={otherParticipantProfile.photoURL}
                    alt={otherParticipantProfile.displayName}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                  <span>
                    {otherParticipantProfile.displayName}: {inbox.lastMessage}
                  </span>
                  {inbox.unreadCounts[user.uid] > 0 && (
                    <span> ({inbox.unreadCounts[user.uid]} unread)</span>
                  )}</a>
                </>
              ) : (
                <span>Loading...</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}