

"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import ImageUpload from "./ImageUpload";
import { Add } from "@mui/icons-material";
import { useProfile } from '@/hooks/useProfile';


import { Card, Avatar } from "@mui/material";

export default function UploadPage() {
  const { profile } = useProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      
      <div className="relative inline-block"  onClick={() => setIsModalOpen(true)}> 
        <Card
          className=" cursor-pointer active:scale-95 duration-300 transition-all"
          sx={{ borderRadius: '50%' }}
          
        >
          <Avatar src={profile?.profilePhotoURL} alt={profile?.username} >
            {profile?.username.slice(0, 1)}
          </Avatar>
        </Card>
        <div className="absolute bottom-0 right-0 p-1 bg-white/90 rounded-full shadow"> {/* Positioned plus button */}
          <Add className="w-2 h-2 text-gray-700   " />
        </div>
      </div>
      <p><small className="text-center">Add story</small></p>
      

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



