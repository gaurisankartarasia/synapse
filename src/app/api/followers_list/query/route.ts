
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { db } from "@/lib/firebaseAdmin";
// import { verifyJWT } from "@/lib/jwt";
// import { QueryDocumentSnapshot } from "firebase-admin/firestore";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const username = searchParams.get("username");

//   if (!username) {
//     return NextResponse.json({ error: "Username is required" }, { status: 400 });
//   }

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");
//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = await verifyJWT(token.value);
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const userQuery = await db.collection("users").where("username", "==", username).limit(1).get();
//     if (userQuery.empty) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const targetUid = userQuery.docs[0].id;
//     const currentUid = payload.uid;

//     // Fetch followers and following in parallel for optimization
//     const [followersSnapshot, followingSnapshot] = await Promise.all([
//       db.collection(`users/${targetUid}/followers`).get(),
//       db.collection(`users/${targetUid}/following`).get()
//     ]);

//     const processUserData = async (doc: QueryDocumentSnapshot) => {
//       const userDoc = await db.collection("users").doc(doc.id).get();
//       const data = userDoc.data();

//       if (!data) return null;

//       const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
//         db.collection(`users/${currentUid}/following`).doc(doc.id).get(),
//         db.collection(`users/${doc.id}/followRequests`).doc(currentUid).get(),
//         db.collection(`users/${doc.id}/following`).doc(currentUid).get(),
//       ]);

//       return {
//         uid: doc.id,
//         profilePhotoURL: data.profilePhotoURL || null,
//         displayName: data.displayName || data.username,
//         username: data.username,
//         isVerified: data.isVerified || false,
//         isPrivate: data.isPrivate || false,
//         isFollowing: followingStatus.exists,
//         isRequested: requestStatus.exists,
//         isFollowingWithoutFollowback: followedByStatus.exists && !followingStatus.exists,
//       };
//     };

//     const [followers, following] = await Promise.all([
//       Promise.all(followersSnapshot.docs.map(processUserData)),
//       Promise.all(followingSnapshot.docs.map(processUserData))
//     ]);

//     return NextResponse.json({
//       followers: followers.filter(Boolean),
//       following: following.filter(Boolean),
//       totalFollowers: followers.length,
//       totalFollowing: following.length
//     });
//   } catch (error) {
//     console.error("Error fetching follow list:", error);
//     return NextResponse.json({ error: "Failed to fetch follow list" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/firebaseAdmin";
import { verifyJWT } from "@/lib/jwt";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

type ProcessedUserData = {
  uid: string;
  profilePhotoURL: string | null;
  displayName: string;
  username: string;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing: boolean;
  isRequested: boolean;
  isFollowingWithoutFollowback: boolean;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token.value);
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    const currentUid = payload.uid;

    const userQuery = await db.collection("users").where("username", "==", username).limit(1).get();
    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUid = userQuery.docs[0].id;

    const [followersSnapshot, followingSnapshot] = await Promise.all([
      db.collection(`users/${targetUid}/followers`).get(),
      db.collection(`users/${targetUid}/following`).get()
    ]);

    const processUserData = async (doc: QueryDocumentSnapshot): Promise<ProcessedUserData | null> => {
      const followerOrFollowingUid = doc.id;
      const userDoc = await db.collection("users").doc(followerOrFollowingUid).get();
      const data = userDoc.data();

      if (!data) return null;

      const [followingStatus, requestStatus, followedByStatus] = await Promise.all([
        db.collection(`users/${currentUid}/following`).doc(followerOrFollowingUid).get(),
        db.collection(`users/${followerOrFollowingUid}/followRequests`).doc(currentUid).get(),
        db.collection(`users/${followerOrFollowingUid}/following`).doc(currentUid).get(),
      ]);

      return {
        uid: followerOrFollowingUid,
        profilePhotoURL: data.profilePhotoURL || null,
        displayName: data.displayName || data.username,
        username: data.username,
        isVerified: data.isVerified || false,
        isPrivate: data.isPrivate || false,
        isFollowing: followingStatus.exists,
        isRequested: requestStatus.exists,
        isFollowingWithoutFollowback: followedByStatus.exists && !followingStatus.exists,
      };
    };

    const [followersData, followingData] = await Promise.all([
      Promise.all(followersSnapshot.docs.map(processUserData)),
      Promise.all(followingSnapshot.docs.map(processUserData))
    ]);

    const validFollowers = followersData.filter((user): user is ProcessedUserData => user !== null);
    const validFollowing = followingData.filter((user): user is ProcessedUserData => user !== null);

    validFollowers.sort((a, b) => {
      if (a.isFollowing && !b.isFollowing) {
        return -1;
      }
      if (!a.isFollowing && b.isFollowing) {
        return 1;
      }
      // Optional secondary sort: return a.username.localeCompare(b.username);
      return 0;
    });

    return NextResponse.json({
      followers: validFollowers,
      following: validFollowing,
      totalFollowers: validFollowers.length,
      totalFollowing: validFollowing.length
    });

  } catch (error) {
    console.error("Error fetching follow list:", error);
    if (error instanceof Error && error.message.includes("JWT")) {
       return NextResponse.json({ error: "Authentication error" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch follow list" }, { status: 500 });
  }
}