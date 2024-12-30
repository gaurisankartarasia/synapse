"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';

export default function Back() {
  const router = useRouter();

  return (
    <div>
      <Button
      variant="flat"
        onPress={() => router.back()}
        startContent={<ArrowLeft />} 
      >
        Go back
      </Button>
    </div>
  );
}