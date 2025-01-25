// //app/api/user/profile/[username]/route.ts
// import { db } from "@/lib/firebaseAdmin"; // Firebase Admin SDK setup
// import { NextRequest, NextResponse } from "next/server";

// type Props = {
//   params: Promise<{ username: string }>;
// };

// export async function GET(req: NextRequest, { params }: Props) {
//   try {
//     // Resolve the params promise to get the username
//     const resolvedParams = await params;
//     const { username } = resolvedParams;

//     if (!username) {
//       return NextResponse.json({ error: "Missing username" }, { status: 400 });
//     }

//     // Step 1: Query users collection directly by username
//     const usersQuerySnapshot = await db
//       .collection("users")
//       .where("username", "==", username)
//       .get();

//     if (usersQuerySnapshot.empty) {
//       return NextResponse.json({ error: "Username not found" }, { status: 404 });
//     }

//     // Get the first matching user document (usernames should be unique)
//     const userDoc = usersQuerySnapshot.docs[0];
//     const userData = userDoc.data();

//     // Select only necessary fields for the profile
//     const profile = {
//       uid:userData.uid,
//       displayName: userData?.displayName || "",
//       followersCount: userData?.followersCount || 0,
//       followingCount: userData?.followingCount || 0,
//       photoURL: userData?.photoURL || "",
//       private: userData?.private || false,
//       username: userData?.username || "",
//       verified: userData?.verified || false,
//     };

//     return NextResponse.json({ profile }, {
//       headers: {
//         'Cache-Control': 'public, max-age=60, s-maxage=300',
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }






// app/api/user/profile-info/[username]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params;
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
      followersCount: userData.followersCount || 0,
      followingCount: userData.followingCount || 0,
      photoURL: userData.photoURL || "",
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
      followersCount: profile.followersCount 
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