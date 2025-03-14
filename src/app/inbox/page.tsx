

// "use client";

import { div } from "@tensorflow/tfjs";

// import { useInbox } from '@/hooks/inbox/useInboxList';
// import Image from 'next/image';
// import { format } from 'date-fns';
// import Link from 'next/link';
// import { Spinner } from '@/components/ui/Spinner';

// export default function InboxList() {
//   const { inboxes, userProfiles, getOtherParticipant } = useInbox();

//   return (
//     <ul>
//       {inboxes.map((inbox) => {
//         const otherParticipantId = getOtherParticipant(inbox.participants);
//         const otherParticipantProfile = userProfiles[otherParticipantId || ''];

//         const lastMessageTime = inbox.lastMessageTime
//           ? format(inbox.lastMessageTime.toDate(), 'p')
//           : '';

//         return (
//           <li key={inbox.id} className='border-b p-3'>
//             {otherParticipantProfile ? (
//               <Link href={`/inbox/${otherParticipantProfile.uid}`}>
//                 <Image
//                   src={otherParticipantProfile.photoURL}
//                   alt={otherParticipantProfile.displayName}
//                   width={50}
//                   height={50}
//                 />
//                 <span>
//                   {otherParticipantProfile.displayName}: {inbox.lastMessage}
//                   {lastMessageTime && <small> ({lastMessageTime})</small>}
//                 </span>
//                 {inbox.unreadCounts[inbox.id] > 0 && (
//                   <span> ({inbox.unreadCounts[inbox.id]} unread)</span>
//                 )}
//               </Link>
//             ) : (
//               <span className='flex justify-center'> <Spinner/> </span>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );
// }


// src/app/inbox/page.tsx
export default function Page() {
  return (
    <p className="flex items-center justify-center min-h-screen opacity-70 " >Select any chat to start messaging</p>
  )
  ;
}
