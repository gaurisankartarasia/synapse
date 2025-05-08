// src/app/api/v1/store/cart/list/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";

interface CartItem {
  productId: string;
  quantity: number;
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    const uid = payload?.uid;

    if (!uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const cartSnapshot = await db.collection(`users/${uid}/storeCart`).get();

    const cartItems: (CartItem & { id: string })[] = cartSnapshot.docs.map((doc) => {
      const data = doc.data() as CartItem;
      return { id: doc.id, ...data };
    });

    const productFetches = cartItems.map((item) =>
      db.collection("products").doc(item.productId).get()
    );

    const productDocs = await Promise.all(productFetches);

    const itemsWithProductData = cartItems.map((item, index) => {
      const productDoc = productDocs[index];
      const productData = productDoc.exists ? productDoc.data() : null;

      return {
        productId: item.productId,
        quantity: item.quantity,
        product: productData
          ? {
              id: productDoc.id,
              ...productData,
            }
          : null,
      };
    });

    return NextResponse.json({ items: itemsWithProductData });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
