// // 'use client';

// // import { useRouter } from 'next/navigation';
// // import { useAuth } from '@/hooks/useAuth';

// // interface ChatbuttonProps {
// //   targetUserId: string;
// // }

// // export default function Chatbutton({ targetUserId }: ChatbuttonProps) {
// //   const router = useRouter();
// //   const { user } = useAuth();

// //   const startChat = () => {
// //     if (!user) {
// //       // Handle not logged in state
// //       return;
// //     }
// //     router.push(`/inbox/${targetUserId}`);
// //   };

// //   return (
// //     <button
// //       onClick={startChat}
// //       className="m-2"
// //       color='primary'
// //     >
// //      Message
// //     </button>
// //   );
// // }








// // components/ChatButton.tsx
// 'use client';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';

// export default function ChatButton({ targetUserId }: { targetUserId: string }) {
//   const router = useRouter();
//   // const { user } = useAuth();

//   const startChat = () => {
//     // if (!user) return router.push('/signin');
//     router.push(`/inbox/${targetUserId}`);
//   };

//   return (
//     <Button
//       onClick={startChat}
//     >
//       Message
//     </Button>
//   );
// }


// components/profile/ChatButton.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  targetUserId: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ targetUserId }) => {
  const router = useRouter();

  const startChat = () => {
    router.push(`/inbox/${targetUserId}`);
  };

  return (
    <Button
      onClick={startChat}
      variant="outline"
      className="w-full max-w-[200px] mx-auto mt-2"
    >
      Message
    </Button>
  );
};