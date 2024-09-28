

import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");  // Get the username from query params

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the token
    await auth.verifyIdToken(token);

    // Fetch user data for the target username from Firestore
    const userQuerySnapshot = await db.collection("users")
                                      .where("username", "==", username)
                                      .get();

    if (userQuerySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();

    // Remove sensitive fields such as email and uid
    const { email, uid, ...safeUserData } = userData; // Ensure uid from userData is not exposed

    // Return only non-sensitive data to the client
    return NextResponse.json(safeUserData); // No uid or email in the response
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}










