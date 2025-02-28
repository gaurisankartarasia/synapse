
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT and extract user ID
    const payload = await verifyJWT(token.value);
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    // Extract username from query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Fetch UID from username
    const userDoc = await db.collection("users").where("username", "==", username).get();
    if (userDoc.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileUid = userDoc.docs[0].id; // UID of the viewed profile

    // Fetch users that the profile being viewed is following
    const followingSnapshot = await db.collection("users").doc(profileUid).collection("following").get();

    const following = await Promise.all(
      followingSnapshot.docs.map(async (doc) => {
        const followingData = await db.collection("users").doc(doc.id).get();
        const data = followingData.data();

        if (data) {
          return {
            uid: doc.id,
            username: data.username,
            displayName: data.displayName || data.username,
            profilePhotoURL: data.profilePhotoURL || null,
            isVerified: data.isVerified || false,
            isFollowing: true
          };
        }
        return null;
      })
    );

    return NextResponse.json({ following: following.filter(Boolean) });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}
