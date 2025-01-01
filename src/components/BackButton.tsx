"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";


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