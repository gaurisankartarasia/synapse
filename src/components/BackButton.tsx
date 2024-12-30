"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

export default function Back() {
  const router = useRouter();

  return (
    <div>
      <Button
        onClick={() => router.back()}
      >
        Go back
      </Button>
    </div>
  );
}