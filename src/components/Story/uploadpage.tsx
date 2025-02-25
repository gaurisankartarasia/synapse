// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import Modal from "@/components/Modal";
// import ImageUpload from "./ImageUpload";
// import { Plus } from 'lucide-react';
// import { useProfile } from '@/hooks/useProfile';
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import { Card } from "../ui/card";

// export default function UploadPage() {
//   const { profile} = useProfile();

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div className="">
//       {/* Button to open modal */}
//       <Card
//       className=" rounded-full cursor-pointer"
//        onClick={() => setIsModalOpen(true)}>
        
//         <Avatar>
//       <AvatarImage src={profile?.profilePhotoURL} alt="user" />
//       <AvatarFallback>{profile?.username.slice(0,1)}</AvatarFallback>
//     </Avatar>
//        <Plus className="absolute"/>
//        </Card>
//    <p className="text-center">
//    </p>

//       {/* Image Upload Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title="Add story"
//       >
//         <ImageUpload onUploadComplete={() => setIsModalOpen(false)} />
//       </Modal>
//     </div>
//   );
// }





"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ImageUpload from "./ImageUpload";
import { Plus } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card } from "../ui/card";

export default function UploadPage() {
  const { profile } = useProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      {/* Button to open modal */}
      <div className="relative inline-block"> {/* Added relative wrapper */}
        <Card
          className="rounded-full cursor-pointer active:scale-95 duration-300 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile?.profilePhotoURL} alt="user" className='object-cover'/>
            <AvatarFallback>{profile?.username.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Card>
        <div className="absolute bottom-0 right-0 p-1 bg-white/90 rounded-full shadow"> {/* Positioned plus button */}
          <Plus className="w-4 h-4 text-gray-700" />
        </div>
      </div>
      <p className="text-center"></p>

      {/* Image Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add story"
      >
        <ImageUpload onUploadComplete={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}