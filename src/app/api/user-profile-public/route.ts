

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
//     await auth.verifyIdToken(token);

//     // Fetch user data for the target username from Firestore
//     const userQuerySnapshot = await db.collection("users")
//       .where("username", "==", username)
//       .get();

//     if (userQuerySnapshot.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const userDoc = userQuerySnapshot.docs[0];
//     const userData = userDoc.data();

//     // Safely construct the response with the uid included
//     const responseData = {
//       ...userData,
//       uid: userDoc.id, // Include uid from Firestore document ID
//     };

//     // Exclude sensitive fields like email
//     // delete responseData.email;

//     return NextResponse.json(responseData); // Return response including uid
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
//   }
// }





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

//     const isBlocked = targetBlockedCurrent.exists || currentBlockedTarget.exists;
//     const message = currentBlockedTarget.exists
//       ? "You blocked this account."
//       : targetBlockedCurrent.exists
//       ? "This account has blocked you."
//       : "";

//     const responseData = {
//       ...userData,
//       uid: targetUid, // Include UID
//       isBlocked,
//       message,
//     };

//     return NextResponse.json(responseData);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
//   }
// }









import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username"); // Get the username from query params

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);

    // Fetch user data for the target username from Firestore
    const userQuerySnapshot = await db.collection("users")
      .where("username", "==", username)
      .get();

    if (userQuerySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();

    // Fetch block status
    const targetUid = userDoc.id;
    const currentUserUid = decodedToken.uid;

    // Check if the current user has blocked the target user
    const currentBlockedTarget = await db
      .collection("blocks")
      .doc(currentUserUid)
      .collection("blocked")
      .doc(targetUid)
      .get();

    // Check if the target user has blocked the current user
    const targetBlockedCurrent = await db
      .collection("blocks")
      .doc(targetUid)
      .collection("blocked")
      .doc(currentUserUid)
      .get();

    if (targetBlockedCurrent.exists) {
      // Target user has blocked the current user
      return new Response(
        `<html>
          <body>
            <h1>Sorry, this page is not available.</h1>
          </body>
        </html>`,
        { status: 403, headers: { "Content-Type": "text/html" } }
      );
    }

    if (currentBlockedTarget.exists) {
      // Current user has blocked the target user
      const limitedData = {
        username: userData.username,
        displayName: userData.displayName,
        profilePicture: userData.profilePicture,
        message: "You blocked this account.",
      };

      return NextResponse.json(limitedData);
    }

    // If no block exists, return full user data
    const responseData = {
      ...userData,
      uid: targetUid, // Include UID
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}











