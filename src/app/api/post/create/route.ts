

// // app/api/post/create/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@/lib/firebaseAdmin";
// import { Timestamp } from "firebase-admin/firestore";

// export async function POST(request: NextRequest) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     const token = authHeader?.split("Bearer ")[1];
    
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decodedToken = await auth.verifyIdToken(token);
//     const { uid } = decodedToken;

//     const userDoc = await db.collection("users").doc(uid).get();
//     if (!userDoc.exists) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const { username } = userDoc.data() || {};
//     if (!username) {
//       return NextResponse.json({ error: "Username not found" }, { status: 400 });
//     }

//     const body = await request.json();
//     const { title, content, imageUrls } = body;

//     if (!title || !content) {
//       return NextResponse.json({ error: "Invalid data" }, { status: 400 });
//     }

//     const createdAt = Timestamp.now();
//     await db.collection("posts").add({
//       uid,
//       title,
//       content,
//       author: username,
//       createdAt,
//       imageUrls: imageUrls || [], 
//     });

//     return NextResponse.json({ message: "Post saved successfully!" });
//   } catch (error) {
//     console.error("Error saving post:", error);
//     return NextResponse.json({ error: "Failed to save post." }, { status: 500 });
//   }
// }









// app/api/post/create/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const { uid } = decodedToken;

    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { username } = userDoc.data() || {};
    if (!username) {
      return NextResponse.json({ error: "Username not found" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, imageUrls } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const createdAt = Timestamp.now();
    await db.collection("posts").add({
        uid,
        title,
        content,
        author: username,
        createdAt,
        imageUrls: imageUrls || [],
        likes: { total: 0, userLikes: {} }
      });

    return NextResponse.json({ message: "Post saved successfully!" });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Failed to save post." }, { status: 500 });
  }
}







