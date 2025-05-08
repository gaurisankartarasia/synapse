//  //src/app/api/v1/followings_list/query/route.ts

// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { db } from "@/lib/firebaseAdmin";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const username = searchParams.get("username");

//   if (!username) {
//     return NextResponse.json({ error: "Username is required" }, { status: 400 });
//   }

//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify JWT and extract user ID
//     const payload = await verifyJWT(token.value);
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     // Fetch UID from username using an optimized query
//     const userQuery = await db
//       .collection("users")
//       .where("username", "==", username)
//       .limit(1)
//       .get();

//     if (userQuery.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const profileUid = userQuery.docs[0].id; // UID of the viewed profile

//     // Fetch users that the profile is following with a single query
//     const followingSnapshot = await db
//       .collection("users")
//       .doc(profileUid)
//       .collection("following")
//       .get();

//     // Optimized fetching of following users
//     const following = await Promise.all(
//       followingSnapshot.docs.map(async (doc) => {
//         const followingDoc = await db.collection("users").doc(doc.id).get();
//         const data = followingDoc.data();

//         return data ? {
//           uid: doc.id,
//           username: data.username,
//           displayName: data.displayName || data.username,
//           profilePhotoURL: data.profilePhotoURL || null,
//           isVerified: data.isVerified || false,
//           isFollowing: true
//         } : null;
//       })
//     );

//     return NextResponse.json({ 
//       following: following.filter(Boolean),
//       totalFollowing: following.length 
//     });
//   } catch (error) {
//     console.error("Error fetching following:", error);
//     return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Verify JWT and extract current user ID
    const payload = await verifyJWT(token.value);
    
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    
    // Fetch UID of the profile being viewed
    const userQuery = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();
    
    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const profileUid = userQuery.docs[0].id; // UID of the viewed profile
    
    // Fetch following UIDs
    const followingSnapshot = await db
      .collection("users")
      .doc(profileUid)
      .collection("following")
      .get();
    
    // Optimized fetching of following users
    const following = await Promise.all(
      followingSnapshot.docs.map(async (doc) => {
        const followedUserDoc = await db.collection("users").doc(doc.id).get();
        const data = followedUserDoc.data();
        
        // Check if current user is following this user
        const isFollowingCurrentUser = await db
          .collection("users")
          .doc(payload.uid)
          .collection("following")
          .doc(doc.id)
          .get();
        
        return data ? {
          uid: doc.id,
          username: data.username,
          displayName: data.displayName || data.username,
          profilePhotoURL: data.profilePhotoURL || null,
          isVerified: data.isVerified || false,
          isFollowing: isFollowingCurrentUser.exists
        } : null;
      })
    );
    
    return NextResponse.json({
      following: following.filter(Boolean),
      totalFollowing: following.length
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Failed to fetch following" }, { status: 500 });
  }
}