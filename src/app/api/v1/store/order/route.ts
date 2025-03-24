import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    // Get JWT from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user ID
    const payload = await verifyJWT(token.value);
    if (!payload?.uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in the order" }, { status: 400 });
    }

    // Store order in Firestore
    const orderData = {
      userId: payload.uid,
      items,
      createdAt: FieldValue.serverTimestamp(),
      status: "pending",
    };

    const orderRef = await db.collection("orders").add(orderData);

    return NextResponse.json({ message: "Order placed", orderId: orderRef.id }, { status: 201 });
  } catch (error) {
    console.error("Order placement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  try {
    // Get JWT from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const payload = await verifyJWT(token.value);
    if (!payload?.uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch user's orders from Firestore
    const ordersSnapshot = await db
      .collection("orders")
      .where("userId", "==", payload.uid)
      .orderBy("createdAt", "desc")
      .get();

    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Fetching orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
