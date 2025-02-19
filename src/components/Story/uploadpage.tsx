"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ImageUpload from "./ImageUpload";
import { Plus } from 'lucide-react';

export default function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      {/* Button to open modal */}
      <button
      className="p-5 rounded-full bg-gray-200"
       onClick={() => setIsModalOpen(true)}><Plus/></button>
   <p className="text-center">
   <small>Add story</small>
   </p>

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
