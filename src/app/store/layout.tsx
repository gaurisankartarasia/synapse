import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, Shirt, House } from "lucide-react";

export const metadata: Metadata = {
  title: "Store",
  description: "Store",
};

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="flex justify-end">
      <Link
          href="/store"
          className="hover:bg-accent p-2 rounded-xl flex gap-2"
        >
          <House size={20} />
          Home
        </Link>
        <Link
          href="/store/orders"
          className="hover:bg-accent p-2 rounded-xl flex gap-2"
        >
          <Shirt size={20} />
          Orders
        </Link>
        <Link
          href="/store/cart"
          className="hover:bg-accent p-2 rounded-xl flex gap-2"
        >
          <ShoppingCart size={20}  />
          Cart
        </Link>
      </div>

      {children}
      {/* <Cart/> */}
    </main>
  );
}
