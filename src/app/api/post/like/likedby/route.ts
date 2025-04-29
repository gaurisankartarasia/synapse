
// // // app/api/post/like/likedby/route.ts

// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: NextRequest) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Verify token and type assert the payload
//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

//     if (!payload.uid) {
//       return NextResponse.json(
//         { error: "Invalid token payload" },
//         { status: 401 }
//       );
//     }

//     const url = new URL(request.url);
//     const postId = url.searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json(
//         { error: "Post ID is required" },
//         { status: 400 }
//       );
//     }

//     // Reference to the likes subcollection
//     const likesRef = db.collection("posts").doc(postId).collection("likes");
//     const likeDocs = await likesRef.get();

//     if (likeDocs.empty) {
//       return NextResponse.json({ users: [] });
//     }

//     // Get user details for each like, including the timestamp
//     const userPromises = likeDocs.docs.map(async (doc) => {
//       const userId = doc.id; // UID is the document ID
//       const userDoc = await db.collection("users").doc(userId).get();
//       const userData = userDoc.data();
//       const likeData = doc.data(); // Get like document data

//       return {
//         uid: userId,
//         username: userData?.username || "Unknown User",
//         profilePhotoURL: userData?.profilePhotoURL || "/default.webp",
//         timestamp: likeData?.timestamp, 
//       };
//     });

//     const users = await Promise.all(userPromises);

  

//     return NextResponse.json({ users });
//   } catch (error) {
//     console.error("Error fetching liked users:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }


//src/app/api/post/like/likedby/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload.uid) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Reference to the likes subcollection
    const likesRef = db.collection("posts").doc(postId).collection("likes");
    const likeDocs = await likesRef.get();

    if (likeDocs.empty) {
      return NextResponse.json({ users: [] });
    }

    // Get user details for each like, including the timestamp
    const userPromises = likeDocs.docs.map(async (doc) => {
      const userId = doc.id; // UID is the document ID
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const likeData = doc.data(); // Get like document data

      if (!userData) {
        return null; // Skip users with missing data
      }

      // Fetch follow status
      const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
        db.collection(`users/${payload.uid}/following`).doc(userId).get(),
        db.collection(`users/${userId}/followRequests`).doc(payload.uid).get(),
        db.collection(`users/${userId}/following`).doc(payload.uid).get(),
      ]);

      return {
        uid: userId,
        username: userData.username || "Unknown User",
        profilePhotoURL: userData.profilePhotoURL || "/default.webp",
        timestamp: likeData?.timestamp,
        isFollowing: followingStatus.exists,
        isRequested: requestStatus.exists,
        isFollowingWithoutFollowback: followedByStatus.exists && !followingStatus.exists,
      };
    });

    const users = (await Promise.all(userPromises)).filter(Boolean); // Remove null users

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching liked users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
