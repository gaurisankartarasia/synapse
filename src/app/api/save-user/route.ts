// src/app/api/save-user/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  const userData = await request.json();

  if (!token) {
    console.error("No token provided");
    return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
  }

  try {
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    console.log("Token verified successfully:", decodedToken);

    // Ensure the user UID matches the token UID for security
    if (decodedToken.uid !== userData.uid) {
      console.error("UID mismatch:", decodedToken.uid, userData.uid);
      return NextResponse.json({ error: "Unauthorized - UID mismatch" }, { status: 401 });
    }

    // Save user data to Firestore
    const userRef = db.collection("users").doc(userData.uid);
    await userRef.set(userData, { merge: true });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error verifying token or saving user data:", error);
    return NextResponse.json({ error: "Failed to save user data" }, { status: 500 });
  }
}
