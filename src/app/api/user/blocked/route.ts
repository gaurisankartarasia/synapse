import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedToken = (await verifyJWT(token)) as CustomJWTPayload;
    if (!decodedToken.uid) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

    const currentUid = decodedToken.uid;

    // Fetch blocked users from Firestore
    const blockedSnapshot = await db.collection(`users/${currentUid}/blocked`).get();
    if (blockedSnapshot.empty) return NextResponse.json([]);

    const blockedUsers = await Promise.all(
      blockedSnapshot.docs.map(async (doc) => {
        const userDoc = await db.collection("users").doc(doc.id).get();
        if (!userDoc.exists) return null;
        const userData = userDoc.data();
        return {
          uid: doc.id,
          username: userData?.username || "Unknown",
          displayName: userData?.displayName || "",
          profilePhotoURL: userData?.profilePhotoURL,
          isVerified: userData?.isVerified
        };
      })
    );

    return NextResponse.json(blockedUsers.filter(Boolean));
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
