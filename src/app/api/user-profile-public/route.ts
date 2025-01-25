

// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function GET(request: Request) {
//   const token = request.headers.get("Authorization")?.split("Bearer ")[1];
//   const { searchParams } = new URL(request.url);
//   const username = searchParams.get("username"); // Get the username from query params

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Verify the token
//     const decodedToken = await auth.verifyIdToken(token);

//     // Fetch user data for the target username from Firestore
//     const userQuerySnapshot = await db.collection("users")
//       .where("username", "==", username)
//       .get();

//     if (userQuerySnapshot.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const userDoc = userQuerySnapshot.docs[0];
//     const userData = userDoc.data();

//     // Fetch block status
//     const targetUid = userDoc.id;
//     const currentUserUid = decodedToken.uid;

//     // Check if the current user has blocked the target user
//     const currentBlockedTarget = await db
//       .collection("blocks")
//       .doc(currentUserUid)
//       .collection("blocked")
//       .doc(targetUid)
//       .get();

//     // Check if the target user has blocked the current user
//     const targetBlockedCurrent = await db
//       .collection("blocks")
//       .doc(targetUid)
//       .collection("blocked")
//       .doc(currentUserUid)
//       .get();

//     if (targetBlockedCurrent.exists) {
//       // Target user has blocked the current user
//       return new Response(
//         `<html>
//           <body>
//             <h1>Sorry, this page is not available.</h1>
//           </body>
//         </html>`,
//         { status: 403, headers: { "Content-Type": "text/html" } }
//       );
//     }

//     if (currentBlockedTarget.exists) {
//       // Current user has blocked the target user
//       const limitedData = {
//         username: userData.username,
//         displayName: userData.displayName,
//         profilePicture: userData.profilePicture,
//         message: "You blocked this account.",
//       };

//       return NextResponse.json(limitedData);
//     }

//     // If no block exists, return full user data
//     const responseData = {
//       ...userData,
//       uid: targetUid, // Include UID
//     };

//     return NextResponse.json(responseData);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
//   }
// }










// src/app/api/user-profile-public/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Get target user data
    const userQuery = await db.collection("users")
      .where("username", "==", username)
      .get();

    if (userQuery.empty) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetUserDoc = userQuery.docs[0];
    const targetUid = targetUserDoc.id;
    const targetUserData = targetUserDoc.data();

    // Check for blocks in both directions
    const currentUserBlocked = await db
      .collection("blocks")
      .doc(decodedToken.uid)
      .collection("blocked")
      .doc(targetUid)
      .get();

    const targetUserBlocked = await db
      .collection("blocks")
      .doc(targetUid)
      .collection("blocked")
      .doc(decodedToken.uid)
      .get();

    // Handle blocking scenarios
    if (targetUserBlocked.exists) {
      return NextResponse.json(
        { error: "Content not available" },
        { status: 403 }
      );
    }

    if (currentUserBlocked.exists) {
      return NextResponse.json({
        username: targetUserData.username,
        displayName: targetUserData.displayName,
        photoURL: targetUserData.photoURL,
        blocked: true
      });
    }

    // Return full user data if no blocks exist
    return NextResponse.json({
      ...targetUserData,
      uid: targetUid
    });

  } catch (error) {
    console.error("Error in public profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}