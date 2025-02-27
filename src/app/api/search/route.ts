

// // src/app/api/search/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { db } from "@/lib/firebaseAdmin";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: Request) {
//   try {
//     // Get and verify token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Verify token and type assert the payload
//     const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
//     if (!payload.uid) {
//       return NextResponse.json(
//         { error: "Invalid token payload" },
//         { status: 401 }
//       );
//     }

//     // Get search term from URL
//     const url = new URL(request.url);
//     const searchTerm = url.searchParams.get("q")?.toLowerCase() || "";

//     if (!searchTerm) {
//       return NextResponse.json(
//         { error: "Search term is required" }, 
//         { status: 400 }
//       );
//     }

//     // Perform search query
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
//       profilePhotoURL: doc.data().profilePhotoURL,
//       isPrivate: doc.data().isPrivate,
//       isVerified: doc.data().isVerified
//     }));

//     return NextResponse.json({ users });
//   } catch (error) {
//     console.error("Error searching users:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




//src/app/api/search/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { db } from "@/lib/firebaseAdmin";
import { CustomJWTPayload } from "@/types/auth";

// Define proper types for our user data
interface UserData {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isPrivate: boolean;
  isVerified: boolean;
}

// Define search result with score for ranking
interface EnhancedUserData extends UserData {
  score: number;
}

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

    // Create a cache to avoid duplicate results
    const userCache = new Map<string, EnhancedUserData>();
    
    // Get prefix matches for username (these are most relevant)
    const usersRef = db.collection("users");
    const usernameSnapshot = await usersRef
      .where("username", ">=", searchTerm)
      .where("username", "<=", searchTerm + "\uf8ff")
      .limit(10)
      .get();
    
    // Process username matches with high priority score
    usernameSnapshot.docs.forEach(doc => {
      const data = doc.data();
      userCache.set(doc.id, {
        uid: doc.id,
        username: data.username || '',
        displayName: data.displayName || '',
        profilePhotoURL: data.profilePhotoURL || '',
        isPrivate: !!data.isPrivate,
        isVerified: !!data.isVerified,
        score: 100 // Highest priority for username prefix matches
      });
    });
    
    // Get prefix matches for displayName
    const displayNameSnapshot = await usersRef
      .where("displayName", ">=", searchTerm)
      .where("displayName", "<=", searchTerm + "\uf8ff")
      .limit(10)
      .get();
    
    // Process display name matches with medium priority score
    displayNameSnapshot.docs.forEach(doc => {
      if (!userCache.has(doc.id)) {
        const data = doc.data();
        userCache.set(doc.id, {
          uid: doc.id,
          username: data.username || '',
          displayName: data.displayName || '',
          profilePhotoURL: data.profilePhotoURL || '',
          isPrivate: !!data.isPrivate,
          isVerified: !!data.isVerified,
          score: 80 // Medium priority for displayName prefix matches
        });
      }
    });
    
    // For partial matches (like "tarasia" in "Gaurisankar Tarasia"), we need a different approach
    // We'll use a more general query and then filter in memory
    if (userCache.size < 5) {
      // Only run this expensive query if we don't have enough results yet
      // First try searching for last name matches by checking if it contains a space
      const displayNameWords = searchTerm.trim().split(/\s+/);
      const partialMatchSnapshot = await usersRef
        .orderBy("displayName")
        .limit(50)
        .get();
      
      partialMatchSnapshot.docs.forEach(doc => {
        if (!userCache.has(doc.id)) {
          const data = doc.data();
          const displayName = (data.displayName || '').toLowerCase();
          const username = (data.username || '').toLowerCase();
          
          // Check for partial matches in displayName (especially last names)
          const nameParts = displayName.split(/\s+/);
          let score = 0;
          
          // Last name check (highest priority for partial matches)
          if (nameParts.length > 1) {
            const lastName = nameParts[nameParts.length - 1];
            if (lastName.includes(searchTerm)) {
              score = 70; // Good priority for last name matches
            }
          }
          
          // Middle of display name check
          if (score === 0 && displayName.includes(searchTerm)) {
            score = 60; // Medium priority for display name contains
          }
          
          // Middle of username check
          if (score === 0 && username.includes(searchTerm)) {
            score = 50; // Lower priority for username contains
          }
          
          if (score > 0) {
            userCache.set(doc.id, {
              uid: doc.id,
              username: data.username || '',
              displayName: data.displayName || '',
              profilePhotoURL: data.profilePhotoURL || '',
              isPrivate: !!data.isPrivate,
              isVerified: !!data.isVerified,
              score
            }
         
          
          );
          }
         
        }
      });
    }
    
    // Convert Map to Array and sort by score
    const results = Array.from(userCache.values()).sort((a, b) => b.score - a.score);
    
    // Limit to top 20 results and remove the score property
    const users = results.slice(0, 20).map(({ score, ...user }) => user);
    
    return NextResponse.json({ users, status: "querying ok" });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}