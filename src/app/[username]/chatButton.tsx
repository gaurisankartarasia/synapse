// // components/ChatButton.tsx
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth';

// interface ChatButtonProps {
//   targetUserId: string;
// }

// export default function ChatButton({ targetUserId }: ChatButtonProps) {
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



// components/ChatButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {Button} from "@nextui-org/button";

interface ChatButtonProps {
  targetUserId: string;
}

export default function ChatButton({ targetUserId }: ChatButtonProps) {
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
    <Button
      onClick={startChat}
      className="m-2"
      variant='flat'
      color='primary'
    >
     Message
    </Button>
  );
}