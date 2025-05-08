//src/app/api/v1/mutual-followers/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    const requestingUid = payload.uid;

    if (!requestingUid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const targetUsername = new URL(request.url).searchParams.get("username");

    // Get target user's UID
    const targetUserSnapshot = await db
      .collection("users")
      .where("username", "==", targetUsername)
      .get();

    if (targetUserSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserUid = targetUserSnapshot.docs[0].id;

    // Check privacy settings
    const targetUserDoc = await db.collection("users").doc(targetUserUid).get();
    const isPrivate = targetUserDoc.data()?.private;
    
    const isFollowing = (await db
      .collection("users")
      .doc(targetUserUid)
      .collection("followers")
      .doc(requestingUid)
      .get()
    ).exists;

    if (isPrivate && !isFollowing && requestingUid !== targetUserUid) {
      return NextResponse.json(
        { error: "Cannot view followers of a private account" },
        { status: 403 }
      );
    }

    // 1. Get list of users that requesting user follows
    const requestingUserFollowingSnapshot = await db
      .collection("users")
      .doc(requestingUid)
      .collection("following")
      .get();

    const followingIds = requestingUserFollowingSnapshot.docs.map(doc => doc.id);

    // 2. Get target user's followers
    const targetUserFollowersSnapshot = await db
      .collection("users")
      .doc(targetUserUid)
      .collection("followers")
      .get();

    const targetUserFollowers = new Set(targetUserFollowersSnapshot.docs.map(doc => doc.id));

    // 3. Find intersection: users that requesting user follows who also follow target user
    const mutualIds = followingIds.filter(id => targetUserFollowers.has(id));

    // 4. Fetch user details for mutual followers
    const mutualFollowers = await Promise.all(
      mutualIds.map(async (uid) => {
        const userDoc = await db.collection("users").doc(uid).get();
        const userData = userDoc.data();
        return {
          uid,
          username: userData?.username,
          displayName: userData?.displayName,
          profilePhotoURL: userData?.profilePhotoURL,
          isVerified: userData?.isVerified,
        };
      })
    );

    return NextResponse.json({ mutualFollowers });
  } catch (error) {
    console.error("Error fetching mutual followers:", error);
    return NextResponse.json(
      { error: "Failed to fetch mutual followers" },
      { status: 500 }
    );
  }
}