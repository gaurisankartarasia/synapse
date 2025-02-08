// //api/search
// import { NextResponse } from "next/server";
// import { db } from "../../../lib/firebaseAdmin";

// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const searchTerm = url.searchParams.get("q")?.toLowerCase() || "";

//     if (!searchTerm) {
//       return NextResponse.json({ error: "Search term is required" }, { status: 400 });
//     }

//     const usersRef = db.collection("users");
//     const snapshot = await usersRef
//       .where("username", ">=", searchTerm)
//       .where("username", "<=", searchTerm + "\uf8ff")
//       .limit(20)
//       .get();

//     const users = snapshot.docs.map(doc => ({
//       uid: doc.id,
//       username: doc.data().username,
//       displayName: doc.data().displayName,
//       photoURL: doc.data().photoURL,
//       private: doc.data().private || false,
//     }));

//     return NextResponse.json({ users });
//   } catch (error) {
//     console.error("Error searching users:", error);
//     return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
//   }
// }



// src/app/api/search/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    // Get and verify token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Get search term from URL
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("q")?.toLowerCase() || "";

    if (!searchTerm) {
      return NextResponse.json(
        { error: "Search term is required" }, 
        { status: 400 }
      );
    }

    // Perform search query
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("username", ">=", searchTerm)
      .where("username", "<=", searchTerm + "\uf8ff")
      .limit(20)
      .get();

    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      username: doc.data().username,
      displayName: doc.data().displayName,
      photoURL: doc.data().photoURL,
      is_private: doc.data().is_private,
      is_verified: doc.data().is_verified
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}