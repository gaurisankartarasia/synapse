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
//       color='primary'
//     >
//      Message
//     </button>
//   );
// }








// components/ChatButton.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ChatButton({ targetUserId }: { targetUserId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const startChat = () => {
    if (!user) return router.push('/signin');
    router.push(`/inbox/${targetUserId}`);
  };

  return (
    <button
      onClick={startChat}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Message
    </button>
  );
}