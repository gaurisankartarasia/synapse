"use client";

import React from "react";
import { useRouter } from "next/navigation";


export default function Back() {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.back()}
      >
        Go back
      </button>
    </div>
  );
}