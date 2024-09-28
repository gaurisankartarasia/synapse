// src/app/api/get-following/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const followingSnapshot = await db
      .collection("users")
      .doc(uid)
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
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}





