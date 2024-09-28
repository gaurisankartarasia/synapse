  // /api/notifications/route.ts
  import { NextResponse } from "next/server";
  import { auth, db } from "../../../lib/firebaseAdmin";

  export async function GET(request: Request) {
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      const currentUid = decodedToken.uid;

      const followRequestsSnapshot = await db
        .collection("users")
        .doc(currentUid)
        .collection("followRequests")
        .orderBy("timestamp", "desc")
        .get();

      const followRequests = [];

      for (const doc of followRequestsSnapshot.docs) {
        const fromUid = doc.id;
        const timestamp = doc.data().timestamp;

        const userDoc = await db.collection("users").doc(fromUid).get();
        const userData = userDoc.data();

        if (userData) {
          followRequests.push({
            fromUid,
            timestamp,
            username: userData.username || "Unknown Username",
            displayName: userData.displayName || "Unknown Name",
            photoURL: userData.photoURL || "/default-profile.png",
          });
        }
      }

      return NextResponse.json({ followRequests });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
  }
