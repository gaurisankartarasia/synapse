// src/app/inbox/layout.tsx
"use client";

import { ReactNode } from 'react';
import InboxList from '../../components/inbox/List';

export default function InboxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <InboxList />
      </div>
      <div className="w-2/3">
        {children}
      </div>
    </div>
  );
}