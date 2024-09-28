// // src/app/api/create-user/route.ts
// import { NextResponse } from "next/server";
// import { auth, db } from "../../../lib/firebaseAdmin";

// export async function POST(request: Request) {
//   try {
//     const { token } = await request.json();

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
//     }

//     // Verify the Firebase ID token
//     const decodedToken = await auth.verifyIdToken(token);
//     const uid = decodedToken.uid;

//     // Check if the user document exists
//     const userRef = db.collection("users").doc(uid);
//     const userDoc = await userRef.get();
    

//     if (!userDoc.exists) {
        
//       // Create the user document with initial data
//       await userRef.set({
//         email: decodedToken.email || "",
//         displayName: decodedToken.name || "",
//         photoURL: decodedToken.picture || "",
//         createdAt: new Date().toISOString(),
//       });
//     }

//     return NextResponse.json({ status: "User document created or already exists" });
//   } catch (error) {
//     console.error("Error creating user document:", error);
//     return NextResponse.json({ error: "Failed to create user document" }, { status: 500 });
//   }
// }





// src/app/api/create-user/route.ts
import { NextResponse } from "next/server";
import { auth, db } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if the user document exists
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create the user document with initial data, including the default bio
      await userRef.set({
        email: decodedToken.email || "",
        displayName: decodedToken.name || "",
        photoURL: decodedToken.picture || "",
        verified: false,
        bio: "Hey, I am using Quixxle!", 
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ status: "User document created or already exists" });
  } catch (error) {
    console.error("Error creating user document:", error);
    return NextResponse.json({ error: "Failed to create user document" }, { status: 500 });
  }
}
