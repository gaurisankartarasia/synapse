import { NextResponse } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { token } = await req.json(); // User token from frontend
    const payload = await verifyJWT(token);

    if (!payload?.uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity } = await req.json();

    const userRef = db.collection("users").doc(payload.uid);
    await userRef.update({
      cart: FieldValue.arrayUnion({ productId, quantity }),
    });

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
