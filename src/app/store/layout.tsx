
// StoreLayout.tsx (Server Component)
import type { Metadata } from "next";
import StoreLayoutClient from "./layout_client";

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreLayoutClient>{children}</StoreLayoutClient>;
}
