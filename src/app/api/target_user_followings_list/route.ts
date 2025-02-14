
// src/app/api/get-following/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT token
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    const requestingUid = payload.uid;

    if (!requestingUid) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const targetUsername = new URL(request.url).searchParams.get("username");

    // Fetch target user's UID by username
    const targetUserSnapshot = await db
      .collection("users")
      .where("username", "==", targetUsername)
      .get();

    if (targetUserSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserUid = targetUserSnapshot.docs[0].id;

    // Check if the requesting user is allowed to view this data
    const privacyCheck = await db.collection("users").doc(targetUserUid).get();
    const isPrivate = privacyCheck.data()?.private;
    
    const isFollowing = (
      await db
        .collection("users")
        .doc(targetUserUid)
        .collection("followers")
        .doc(requestingUid)
        .get()
    ).exists;

    if (isPrivate && !isFollowing && requestingUid !== targetUserUid) {
      return NextResponse.json(
        { error: "This user's following list is private" },
        { status: 403 }
      );
    }

    // Fetch the following list
    const followingSnapshot = await db
      .collection("users")
      .doc(targetUserUid)
      .collection("following")
      .get();

    const following = await Promise.all(
      followingSnapshot.docs.map(async (doc) => {
        const followingData = await db.collection("users").doc(doc.id).get();
        return { uid: doc.id, ...followingData.data() };
      })
    );

    return NextResponse.json({ following });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json(
      { error: "Failed to fetch following" },
      { status: 500 }
    );
  }
}