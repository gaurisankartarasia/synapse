// src/app/api/store/wishlist/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import type { CustomJWTPayload } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = (await verifyJWT(token)) as CustomJWTPayload;
    const uid = decoded?.uid;

    if (!uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const productId: string = body.productId;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    await db
      .collection(`users/${uid}/storeWishlist`)
      .doc(productId)
      .set({ createdAt: new Date().toISOString(),
        productId: productId,
       });

    return NextResponse.json({ message: "Product added to wishlist" }, { status: 200 });
  } catch (error) {
    console.error("Wishlist API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
