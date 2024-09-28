import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { token, private: isPrivate } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update privacy setting
    await userRef.update({ private: isPrivate });

    return NextResponse.json({ status: "Privacy settings updated successfully" });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    return NextResponse.json({ error: "Failed to update privacy settings" }, { status: 500 });
  }
}
