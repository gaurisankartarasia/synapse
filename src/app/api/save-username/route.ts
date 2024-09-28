// // src/app/api/save-username/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function POST(request: Request) {
//   try {
//     const { username, token } = await request.json();

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
//     }

//     // Verify the Firebase ID token to ensure the request is authenticated
//     const decodedToken = await auth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     // Validate the username format (lowercase, numbers, underscores)
//     const usernameRegex = /^[a-z0-9_]+$/;
//     if (!username || !usernameRegex.test(username)) {
//       return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
//     }

//     // Check if the username is already taken
//     const usernameRef = db.collection("usernames").doc(username);
//     const usernameDoc = await usernameRef.get();

//     if (usernameDoc.exists) {
//       return NextResponse.json({ error: "Username is taken" }, { status: 409 });
//     }

//     // Save the username and link it to the user
//     await usernameRef.set({ uid });

//     // Additional profile data to be saved
//     const profileData = {
//       username,
//       email: decodedToken.email || "",
//       displayName: decodedToken.name || "",
//       photoURL: decodedToken.picture || ""
//     };

//     // Save the profile data in the user's document
//     await db.collection("users").doc(uid).set(profileData, { merge: true });

//     return NextResponse.json({ status: "success" });
//   } catch (error) {
//     console.error("Error saving username and profile data:", error);
//     return NextResponse.json({ error: "Failed to save username and profile data" }, { status: 500 });
//   }
// }




// src/app/api/save-username/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { username, token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    // Verify the Firebase ID token to ensure the request is authenticated
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Validate the username format (lowercase, numbers, underscores)
    const usernameRegex = /^[a-z0-9_]+$/;
    if (!username || !usernameRegex.test(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
    }

    // Check if the username is already taken
    const usernameRef = db.collection("usernames").doc(username);
    const usernameDoc = await usernameRef.get();

    if (usernameDoc.exists) {
      return NextResponse.json({ error: "Username is taken" }, { status: 409 });
    }

    // Save the username and link it to the user
    await usernameRef.set({ uid });

    // Additional profile data to be saved
    const profileData = {
      username,
      email: decodedToken.email || "",
      displayName: decodedToken.name || "",
      photoURL: decodedToken.picture || "",
      verified:false,
      bio: "Hey, I am using Quixxle!" 
    };

    // Save the profile data in the user's document
    await db.collection("users").doc(uid).set(profileData, { merge: true });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error saving username and profile data:", error);
    return NextResponse.json({ error: "Failed to save username and profile data" }, { status: 500 });
  }
}
