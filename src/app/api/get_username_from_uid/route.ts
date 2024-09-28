import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin"; // Adjust this import path to match your project structure

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "UID is required" }, { status: 400 });
  }

  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    return NextResponse.json({ username: userData?.username || null });
  } catch (error) {
    console.error("Error fetching username from uid:", error);
    return NextResponse.json({ error: "Failed to fetch username" }, { status: 500 });
  }
}
