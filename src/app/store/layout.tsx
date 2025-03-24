

import type { Metadata } from "next";
import Link from "next/link";
import Cart from "./components/Cart";


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
      
            <main  >
<div className="flex justify-evenly">
    <Link href="/store/orders" className="text-blue-500 hover:underline" >Orders</Link>
<Link href="/store/cart" className="text-blue-500 hover:underline" >Cart</Link>
<Link href="/store/checkout" className="text-blue-500 hover:underline" >Checkout</Link></div>

                {children}
                {/* <Cart/> */}
            </main>
            
  );
}



