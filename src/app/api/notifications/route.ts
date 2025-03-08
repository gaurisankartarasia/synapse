
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const currentUid = payload.uid;

    // Fetch follow requests
    const followRequestsSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("followRequests")
      .orderBy("timestamp", "desc")
      .get();

    // Get user details for each follow request
    const followRequests = await Promise.all(
      followRequestsSnapshot.docs.map(async (doc) => {
        const userData = await db.collection("users").doc(doc.id).get();
        
        return {
          id: doc.id,
          timestamp: doc.data()?.timestamp,
          user: {
            uid: userData.id,
            username: userData.data()?.username,
            profilePhotoURL: userData.data()?.profilePhotoURL,
            displayName: userData.data()?.displayName,
            isVerified: userData.data()?.isVerified,
           
          },
           _server:"next route"
        };
      })
    );

    
    return NextResponse.json({ followRequests });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}


