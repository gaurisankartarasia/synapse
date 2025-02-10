

// app/api/user/profile/[username]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest, context: { params: Promise<{ username: string } >}) {
  try {
    const { username } = await context.params;
    const token = req.cookies.get('token')?.value;

    // Fetch profile data
    const userQuery = await db.collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const profile = {
      uid: userDoc.id,
      displayName: userData.displayName || "",
      followerCount: userData.followerCount || 0,
      followingCount: userData.followingCount || 0,
      profilePhotoURL: userData.profilePhotoURL || "",
      private: userData.private || false,
      username: userData.username || "",
      verified: userData.verified || false,
    };

    let followStatus = {};
    if (token) {
      try {
        const { uid } = await verifyJWT(token);
        
        // Check follow status
        const [isFollowing, isRequested] = await Promise.all([
          db.collection("users").doc(uid)
            .collection("following").doc(userDoc.id).get()
            .then(doc => doc.exists),
          
          db.collection("users").doc(userDoc.id)
            .collection("followRequests").doc(uid).get()
            .then(doc => doc.exists)
        ]);

        followStatus = { isFollowing, isRequested };
      } catch (error) {
        console.error("JWT verification failed:", error);
      }
    }

    return NextResponse.json({ 
      profile,
      ...followStatus,
      followerCount: profile.followerCount 
    }, {
      headers: {
        'Cache-Control': 'public, max-age=120, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}