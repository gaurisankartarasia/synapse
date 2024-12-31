// // components/Chatbutton.tsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth';

// interface ChatbuttonProps {
//   targetUserId: string;
// }

// export default function Chatbutton({ targetUserId }: ChatbuttonProps) {
//   const router = useRouter();
//   const { user } = useAuth();

//   const startChat = () => {
//     if (!user) {
//       // Handle not logged in state
//       return;
//     }
//     router.push(`/inbox/${targetUserId}`);
//   };

//   return (
//     <button
//       onClick={startChat}
//       className="m-2"
//     >
//      Message
//     </button>
//   );
// }



// components/Chatbutton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ChatbuttonProps {
  targetUserId: string;
}

export default function Chatbutton({ targetUserId }: ChatbuttonProps) {
  const router = useRouter();
  const { user } = useAuth();

  const startChat = () => {
    if (!user) {
      // Handle not logged in state
      return;
    }
    router.push(`/inbox/${targetUserId}`);
  };

  return (
    <button
      onClick={startChat}
      className="m-2"
      color='primary'
    >
     Message
    </button>
  );
}