
// import { useState, useEffect, useCallback } from 'react';
// import { db } from '@/lib/firebaseClient'; // Assuming this path is correct
// import {
//   onSnapshot,
//   collection,
//   query,
//   where,
//   doc,
//   getDoc,
//   DocumentSnapshot, // Explicitly import DocumentSnapshot
// } from 'firebase/firestore';
// import { useAuth } from '@/hooks/useAuth'; // Assuming this path is correct

// // Interfaces
// interface ChatRoom {
//   id: string;
//   participants: string[];
//   participantKey: string; // Keep if used elsewhere, otherwise potentially remove
//   createdAt: any; // Consider using Firestore Timestamp type if possible
//   lastMessage: string;
//   lastMessageTime: any; // Consider using Firestore Timestamp type if possible
//   unreadCounts: { [userId: string]: number };
// }

// interface UserProfile {
//   uid: string;
//   displayName: string;
//   photoURL: string;
//   username: string;
//   isVerified: boolean;
// }

// // --- Helper function to check block status ---
// // Returns true if either user has blocked the other, false otherwise.
// const checkBlockStatus = async (
//   currentUserUid: string,
//   otherUserUid: string
// ): Promise<boolean> => {
//   // Avoid checks if UIDs are invalid
//   if (!currentUserUid || !otherUserUid || currentUserUid === otherUserUid) {
//     return false;
//   }
//   try {
//     const blockPath1 = doc(db, 'users', currentUserUid, 'blocked', otherUserUid);
//     const blockPath2 = doc(db, 'users', otherUserUid, 'blocked', currentUserUid);

//     // Check both blocking directions concurrently
//     const [blockDoc1, blockDoc2] = await Promise.all([
//       getDoc(blockPath1),
//       getDoc(blockPath2),
//     ]);

//     // Return true if a block document exists in either direction
//     return blockDoc1.exists() || blockDoc2.exists();

//   } catch (error) {
//     console.error("Error checking block status between", currentUserUid, "and", otherUserUid, ":", error);
//     // Decide how to handle errors - safer to assume not blocked to avoid hiding chats due to temporary errors.
//     return false;
//   }
// };

// // --- Module-level Caching ---
// // Initialize with empty array/object instead of null to prevent TS errors
// // and simplify logic.
// let cachedInboxes: ChatRoom[] = [];
// let cachedUserProfiles: { [uid: string]: UserProfile } = {};

// // --- The Hook ---
// export function useInbox() {
//   const { user } = useAuth(); // Get current authenticated user

//   // --- State ---
//   // Initialize state directly from the (now never null) cache variables
//   const [inboxes, setInboxes] = useState<ChatRoom[]>(cachedInboxes);
//   const [userProfiles, setUserProfiles] = useState<{ [uid: string]: UserProfile }>(cachedUserProfiles);
//   const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

//   // --- Utility Functions (Memoized) ---
//   const getOtherParticipantId = useCallback((participants: string[]): string | undefined => {
//       return participants.find((participantId) => participantId !== user?.uid);
//   }, [user?.uid]); // Dependency: user.uid

//   // --- Fetch User Profiles ---
//   const fetchUserProfiles = useCallback(async (filteredInboxes: ChatRoom[]) => {
//     // Don't fetch if no user or no inboxes to check
//     if (!user?.uid || filteredInboxes.length === 0) {
//         // If no inboxes, ensure profiles are also cleared
//         if(filteredInboxes.length === 0) {
//              cachedUserProfiles = {}; // Clear module cache
//              setUserProfiles({});     // Clear state
//         }
//         return;
//     }

//     const profilePromises: Promise<UserProfile | null>[] = [];
//     // Start building the relevant profiles map for this set of inboxes
//     const relevantProfileMap: { [uid: string]: UserProfile } = {};
//     const profileIdsToFetch = new Set<string>();

//     // Check cache first and identify which profiles are missing
//     filteredInboxes.forEach((inbox) => {
//       const otherParticipantId = getOtherParticipantId(inbox.participants);
//       if (otherParticipantId) {
//           // If profile is in module cache, add it to our relevant map
//           if (cachedUserProfiles[otherParticipantId]) {
//               relevantProfileMap[otherParticipantId] = cachedUserProfiles[otherParticipantId];
//           } else {
//               // Otherwise, mark it for fetching (avoid duplicates with Set)
//               profileIdsToFetch.add(otherParticipantId);
//           }
//       }
//     });

//     // Create fetch promises only for the missing profiles
//     profileIdsToFetch.forEach(participantId => {
//         profilePromises.push(
//             getDoc(doc(db, 'users', participantId))
//               .then((docSnap: DocumentSnapshot) => { // Use DocumentSnapshot type
//                 if (docSnap.exists()) {
//                   const data = docSnap.data();
//                   // Construct the profile object
//                   return {
//                     uid: docSnap.id,
//                     displayName: data.displayName || 'Unknown User', // Provide default
//                     photoURL: data.profilePhotoURL || '/default-avatar.png', // Provide default
//                     username: data.username || 'username', // Provide default
//                     isVerified: data.isVerified || false
//                   };
//                 }
//                 console.warn(`User profile not found for UID: ${participantId}`);
//                 return null; // Return null if profile doesn't exist
//               })
//               .catch((error) => {
//                   console.error("Error fetching profile for UID:", participantId, error);
//                   return null; // Return null on error fetching specific profile
//               })
//           );
//     });

//     // Await all fetch promises
//     const fetchedProfiles = await Promise.all(profilePromises);

//     // Add successfully fetched profiles to the relevant map
//     fetchedProfiles.forEach((profile) => {
//       if (profile) {
//         relevantProfileMap[profile.uid] = profile;
//       }
//     });

//     // Update module cache and state *only* with profiles relevant to the current filtered inboxes
//     cachedUserProfiles = relevantProfileMap;
//     setUserProfiles(relevantProfileMap);

//   }, [user?.uid, getOtherParticipantId]); // Dependencies: user.uid, getOtherParticipantId

//   // --- Main Effect for fetching and filtering inboxes ---
//   useEffect(() => {
//     // If no user, clear everything and stop
//     if (!user?.uid) {
//         setIsLoading(false);
//         setInboxes([]);
//         setUserProfiles({});
//         // Reset module caches to empty, not null
//         cachedInboxes = [];
//         cachedUserProfiles = {};
//         return; // Stop execution of the effect
//     }

//     // User is logged in, start loading state
//     setIsLoading(true);

//     // Define the query to get chat rooms involving the current user
//     const q = query(
//       collection(db, 'chatRooms'),
//       where('participants', 'array-contains', user.uid)
//     );

//     // Subscribe to real-time updates
//     const unsubscribe = onSnapshot(q, async (snapshot) => { // Make callback async
//       // Map snapshot docs to ChatRoom objects
//       const fetchedInboxes = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...(doc.data() as Omit<ChatRoom, 'id'>), // Type assertion for data
//       }));

//       // --- Filter based on block status ---
//       // Create an array of promises, each checking block status for an inbox
//       const filterPromises = fetchedInboxes.map(async (inbox) => {
//           const otherParticipantId = getOtherParticipantId(inbox.participants);
//           // If there's no other participant (e.g., corrupted data), filter it out
//           if (!otherParticipantId) {
//               return false;
//           }
//           // Check if either user blocked the other
//           const isBlocked = await checkBlockStatus(user.uid, otherParticipantId);
//           // Keep the inbox only if it's *not* blocked
//           return !isBlocked;
//       });

//       // Wait for all block checks to complete
//       const filterResults = await Promise.all(filterPromises);
//       // Create the final list by filtering based on the results
//       const filteredInboxes = fetchedInboxes.filter((_, index) => filterResults[index]);
//       // --- End Filtering ---

//       // Update module cache with the latest filtered list
//       cachedInboxes = filteredInboxes;
//       // Update component state
//       setInboxes(filteredInboxes);
//       // Data has been processed, stop loading indicator
//       setIsLoading(false);

//       // Fetch/update user profiles based on the *filtered* list of inboxes
//       fetchUserProfiles(filteredInboxes);

//     }, (error) => { // Handle errors during snapshot listening
//         console.error("Error fetching chatRooms snapshot:", error);
//         setIsLoading(false); // Stop loading on error
//         // Clear state
//         setInboxes([]);
//         setUserProfiles({});
//         // Reset module caches to empty, not null
//         cachedInboxes = [];
//         cachedUserProfiles = {};
//     });

//     // Cleanup function: Unsubscribe from snapshot listener when
//     // component unmounts or user.uid changes
//     return () => {
//         unsubscribe();
//     };
//     // Dependencies for the effect
//   }, [user?.uid, fetchUserProfiles, getOtherParticipantId]);

//   // --- Optional: Helper to get the full profile of the other participant ---
//   const getOtherParticipantProfile = useCallback((participants: string[]): UserProfile | undefined => {
//     const otherId = getOtherParticipantId(participants);
//     // Return the profile from state if the other ID exists
//     return otherId ? userProfiles[otherId] : undefined;
//   }, [getOtherParticipantId, userProfiles]); // Dependencies: getOtherParticipantId, userProfiles state

//   // --- Return values from the hook ---
//   return {
//       inboxes,          // The filtered list of chat rooms
//       userProfiles,     // Profiles of participants in the filtered chat rooms
//       isLoading,        // Boolean indicating if initial data is loading/filtering
//       getOtherParticipantProfile // Helper function
//     };
// }











import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseClient'; // Assuming this path is correct
import {
  onSnapshot,
  collection,
  query,
  where,
  doc,
  getDoc,
  DocumentSnapshot, // Explicitly import DocumentSnapshot
  Timestamp, // Import Timestamp for better type safety if possible
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; 

// Interfaces
interface ChatRoom {
  id: string;
  participants: string[];
  // participantKey: string; // Removed if not used elsewhere
  createdAt: Timestamp | any; // Use Firestore Timestamp if possible
  lastMessage: string;
  lastMessageTime: Timestamp | any; // Use Firestore Timestamp if possible
  unreadCounts: { [userId: string]: number };
}

interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  username: string;
  isVerified: boolean;
}

// --- Helper function to check block status ---
// (Keep this function as it was, it's independent of the caching issue)
const checkBlockStatus = async (
  currentUserUid: string,
  otherUserUid: string
): Promise<boolean> => {
  if (!currentUserUid || !otherUserUid || currentUserUid === otherUserUid) {
    return false;
  }
  try {
    const blockPath1 = doc(db, 'users', currentUserUid, 'blocked', otherUserUid);
    const blockPath2 = doc(db, 'users', otherUserUid, 'blocked', currentUserUid);

    const [blockDoc1, blockDoc2] = await Promise.all([
      getDoc(blockPath1),
      getDoc(blockPath2),
    ]);

    return blockDoc1.exists() || blockDoc2.exists();

  } catch (error) {
    console.error("Error checking block status between", currentUserUid, "and", otherUserUid, ":", error);
    return false; // Safer to assume not blocked on error
  }
};

// --- The Hook ---
export function useInbox() {
  const { user } = useAuth(); // Get current authenticated user

  // --- State ---
  // Initialize state directly as empty. No module-level cache.
  const [inboxes, setInboxes] = useState<ChatRoom[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [uid: string]: UserProfile }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  // --- Utility Functions (Memoized) ---
  const getOtherParticipantId = useCallback((participants: string[]): string | undefined => {
      // Return undefined if user is null/undefined to avoid errors during logout transition
      if (!user?.uid) return undefined;
      return participants.find((participantId) => participantId !== user.uid);
  }, [user?.uid]); // Dependency: user.uid

  // --- Fetch User Profiles ---
  // Fetches profiles for the *current* set of filtered inboxes.
  const fetchUserProfiles = useCallback(async (filteredInboxes: ChatRoom[]) => {
    // If no user or no filtered inboxes, clear profiles and return
    if (!user?.uid || filteredInboxes.length === 0) {
        setUserProfiles({}); // Clear component state
        return;
    }

    const profilePromises: Promise<UserProfile | null>[] = [];
    // Build the map of profiles relevant ONLY to the current filteredInboxes
    const relevantProfileMap: { [uid: string]: UserProfile } = {};
    const profileIdsToFetch = new Set<string>();

    // Identify which profile IDs are needed based on filteredInboxes
    filteredInboxes.forEach((inbox) => {
      const otherParticipantId = getOtherParticipantId(inbox.participants);
      if (otherParticipantId) {
        // Check if we *already* have this profile in the current state (optional optimization)
        // For simplicity here, we'll re-fetch needed profiles each time,
        // but you could add: if (!userProfiles[otherParticipantId]) { ... }
        profileIdsToFetch.add(otherParticipantId);
      }
    });

    // Create fetch promises only for the needed profiles
    profileIdsToFetch.forEach(participantId => {
        profilePromises.push(
            getDoc(doc(db, 'users', participantId))
              .then((docSnap: DocumentSnapshot) => {
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  return {
                    uid: docSnap.id,
                    displayName: data.displayName || 'Unknown User',
                    photoURL: data.profilePhotoURL || '/default-avatar.png',
                    username: data.username || 'username',
                    isVerified: data.isVerified || false
                  } as UserProfile; // Type assertion
                }
                console.warn(`User profile not found for UID: ${participantId}`);
                return null;
              })
              .catch((error) => {
                  console.error("Error fetching profile for UID:", participantId, error);
                  return null;
              })
          );
    });

    // Await all fetch promises
    const fetchedProfiles = await Promise.all(profilePromises);

    // Add successfully fetched profiles to the relevant map
    fetchedProfiles.forEach((profile) => {
      if (profile) {
        relevantProfileMap[profile.uid] = profile;
      }
    });

    // Update component state *only* with profiles relevant to the current filtered inboxes
    setUserProfiles(relevantProfileMap);

  }, [user?.uid, getOtherParticipantId]); // Dependencies: user.uid, getOtherParticipantId

  // --- Main Effect for fetching and filtering inboxes ---
  useEffect(() => {
    // If no user, clear component state and stop
    if (!user?.uid) {
        setIsLoading(false); // Stop loading
        setInboxes([]);      // Clear inboxes state
        setUserProfiles({}); // Clear profiles state
        // No module cache to clear
        return; // Stop execution of the effect
    }

    // User is logged in, start loading state (might reset briefly if data comes fast)
    setIsLoading(true);

    // Define the query based on the *current* user's UID
    const q = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', user.uid)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedInboxes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChatRoom, 'id'>),
      }));

      // Filter based on block status (asynchronously)
      const filterPromises = fetchedInboxes.map(async (inbox) => {
          const otherParticipantId = getOtherParticipantId(inbox.participants);
          if (!otherParticipantId) {
              return false; // Filter out if no other participant
          }
          // Check block status using the current user's UID
          const isBlocked = await checkBlockStatus(user.uid, otherParticipantId);
          return !isBlocked; // Keep if not blocked
      });

      const filterResults = await Promise.all(filterPromises);
      const filteredInboxes = fetchedInboxes.filter((_, index) => filterResults[index]);

      // Update component state with the latest filtered list
      setInboxes(filteredInboxes);
      // Data has been processed, stop loading indicator
      setIsLoading(false);

      // Fetch/update user profiles based on the *newly filtered* list of inboxes
      // This will now update the component's userProfiles state correctly.
      fetchUserProfiles(filteredInboxes);

    }, (error) => { // Handle errors during snapshot listening
        console.error("Error fetching chatRooms snapshot:", error);
        setIsLoading(false); // Stop loading on error
        // Clear component state on error
        setInboxes([]);
        setUserProfiles({});
        // No module cache to clear
    });

    // Cleanup function: Unsubscribe from snapshot listener when
    // component unmounts or user.uid changes (logout/login)
    return () => {
        unsubscribe();
    };
    // Dependencies for the effect: Re-run if user changes or helper functions change instance
  }, [user?.uid, fetchUserProfiles, getOtherParticipantId]); // Ensure helpers are stable via useCallback

  // --- Optional: Helper to get the full profile of the other participant ---
  const getOtherParticipantProfile = useCallback((participants: string[]): UserProfile | undefined => {
    const otherId = getOtherParticipantId(participants);
    // Return the profile from component state if the other ID exists
    return otherId ? userProfiles[otherId] : undefined;
  }, [getOtherParticipantId, userProfiles]); // Dependencies: helper function and userProfiles state

  // --- Return values from the hook ---
  return {
      inboxes,          // The filtered list of chat rooms (from state)
      userProfiles,     // Profiles of participants (from state)
      isLoading,        // Boolean indicating if initial data is loading/filtering
      getOtherParticipantProfile // Helper function
    };
}