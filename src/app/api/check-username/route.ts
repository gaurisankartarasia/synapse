// src/app/api/check-username/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { username, token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Validate the username format (lowercase, numbers, underscores)
    const usernameRegex = /^[a-z0-9_]+$/;
    if (!username || !usernameRegex.test(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
    }

    // Check if the username already exists
    const usernameRef = db.collection("usernames").doc(username);
    const usernameDoc = await usernameRef.get();

    if (usernameDoc.exists) {
      return NextResponse.json({ error: "Username is taken" }, { status: 409 });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ error: "Failed to check username" }, { status: 500 });
  }
}
