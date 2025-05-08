// src/app/api/v1/store/cart/add/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload?.uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Missing or invalid data" }, { status: 400 });
    }

    const cartDocRef = db
      .collection("users")
      .doc(payload.uid)
      .collection("storeCart")
      .doc(productId); // Use productId as document ID to avoid duplicates

    const existingCartItem = await cartDocRef.get();

    if (existingCartItem.exists) {
      // Update quantity if the product already exists
      await cartDocRef.update({
        quantity: existingCartItem.data()?.quantity + quantity,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      // Add new cart item
      await cartDocRef.set({
        productId,
        quantity,
        addedAt: new Date(),
      });
    }

    return NextResponse.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
