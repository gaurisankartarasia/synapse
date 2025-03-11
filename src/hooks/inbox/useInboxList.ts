// import { useState, useEffect, useCallback } from 'react';
// import { db } from '@/lib/firebaseClient';
// import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
// import { useAuth } from '@/hooks/useAuth';
// import { format } from 'date-fns';

// interface ChatRoom {
//   id: string;
//   participants: string[];
//   participantKey: string;
//   createdAt: any;
//   lastMessage: string;
//   lastMessageTime: any;
//   unreadCounts: { [userId: string]: number };
// }

// interface UserProfile {
//   uid: string;
//   displayName: string;
//   photoURL: string;
// }

// export function useInbox() {
//   const { user } = useAuth();
//   const [inboxes, setInboxes] = useState<ChatRoom[]>([]);
//   const [userProfiles, setUserProfiles] = useState<{ [uid: string]: UserProfile }>({});

//   const fetchUserProfiles = useCallback(async (inboxes: ChatRoom[]) => {
//     if (!user?.uid) return;
    
//     const profilePromises: Promise<UserProfile | null>[] = [];
//     const profileMap: { [uid: string]: UserProfile } = {};

//     inboxes.forEach((inbox) => {
//       inbox.participants.forEach((participantId) => {
//         if (participantId !== user.uid && !profileMap[participantId]) {
//           profilePromises.push(
//             getDoc(doc(db, 'users', participantId))
//               .then((doc) => {
//                 if (doc.exists()) {
//                   const data = doc.data();
//                   return {
//                     uid: doc.id,
//                     displayName: data.displayName || 'Unknown',
//                     photoURL: data.profilePhotoURL || '/default-avatar.png',
//                   };
//                 }
//                 return null;
//               })
//               .catch(() => null)
//           );
//         }
//       });
//     });

//     const fetchedProfiles = await Promise.all(profilePromises);
//     fetchedProfiles.forEach((profile) => {
//       if (profile) {
//         profileMap[profile.uid] = profile;
//       }
//     });
//     setUserProfiles(profileMap);
//   }, [user?.uid]);

//   useEffect(() => {
//     if (!user?.uid) return;

//     const q = query(
//       collection(db, 'chatRooms'),
//       where('participants', 'array-contains', user.uid)
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedInboxes = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as ChatRoom[];

//       setInboxes(fetchedInboxes);
//       fetchUserProfiles(fetchedInboxes);
//     });

//     return () => unsubscribe();
//   }, [user?.uid, fetchUserProfiles]);

//   const getOtherParticipant = (participants: string[]) => {
//     return participants.find((participantId) => participantId !== user?.uid);
//   };

//   return { inboxes, userProfiles, getOtherParticipant };
// }






import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseClient';
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

interface ChatRoom {
  id: string;
  participants: string[];
  participantKey: string;
  createdAt: any;
  lastMessage: string;
  lastMessageTime: any;
  unreadCounts: { [userId: string]: number };
}

interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  username:string;
  isVerified:boolean;
}

let cachedInboxes: ChatRoom[] | null = null;
let cachedUserProfiles: { [uid: string]: UserProfile } | null = null;

export function useInbox() {
  const { user } = useAuth();
  const [inboxes, setInboxes] = useState<ChatRoom[]>(cachedInboxes || []);
  const [userProfiles, setUserProfiles] = useState<{ [uid: string]: UserProfile }>(cachedUserProfiles || {});

  const fetchUserProfiles = useCallback(async (inboxes: ChatRoom[]) => {
    if (!user?.uid) return;
    
    const profilePromises: Promise<UserProfile | null>[] = [];
    const profileMap: { [uid: string]: UserProfile } = { ...userProfiles };

    inboxes.forEach((inbox) => {
      inbox.participants.forEach((participantId) => {
        if (participantId !== user.uid && !profileMap[participantId]) {
          profilePromises.push(
            getDoc(doc(db, 'users', participantId))
              .then((doc) => {
                if (doc.exists()) {
                  const data = doc.data();
                  return {
                    uid: doc.id,
                    displayName: data.displayName || 'Unknown',
                    photoURL: data.profilePhotoURL || '/default-avatar.png',
                    username: data.username || 'user',
                    isVerified: data.isVerified || false
                  };
                }
                return null;
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
    cachedUserProfiles = profileMap;
    setUserProfiles(profileMap);
  }, [user?.uid, userProfiles]);

  useEffect(() => {
    if (!user?.uid || cachedInboxes) return;

    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedInboxes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatRoom[];

      cachedInboxes = fetchedInboxes;
      setInboxes(fetchedInboxes);
      fetchUserProfiles(fetchedInboxes);
    });

    return () => unsubscribe();
  }, [user?.uid, fetchUserProfiles]);

  const getOtherParticipant = (participants: string[]) => {
    return participants.find((participantId) => participantId !== user?.uid);
  };

  return { inboxes, userProfiles, getOtherParticipant };
}
