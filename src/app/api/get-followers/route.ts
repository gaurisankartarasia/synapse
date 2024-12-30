  // src/app/api/get-followers/route.ts
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

      const followersSnapshot = await db
        .collection("users")
        .doc(uid)
        .collection("followers")
        .get();

      const followers = await Promise.all(
        followersSnapshot.docs.map(async (doc) => {
          const followerData = await db.collection("users").doc(doc.id).get();
          return { uid: doc.id, ...followerData.data() };
        })
      );

      return NextResponse.json({ followers });
    } catch (error) {
      console.error("Error fetching followers:", error);
      return NextResponse.json({ error: "Failed to fetch followers" }, { status: 500 });
    }
  }









