
// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(request: Request) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const currentUid = payload.uid;

//     // Fetch follow requests
//     const followRequestsSnapshot = await db
//       .collection("users")
//       .doc(currentUid)
//       .collection("followRequests")
//       .orderBy("timestamp", "desc")
//       .get();

//     // Get user details for each follow request
//     const followRequests = await Promise.all(
//       followRequestsSnapshot.docs.map(async (doc) => {
//         const userData = await db.collection("users").doc(doc.id).get();
        
//         return {
//           id: doc.id,
//           timestamp: doc.data()?.timestamp,
//           user: {
//             uid: userData.id,
//             username: userData.data()?.username,
//             profilePhotoURL: userData.data()?.profilePhotoURL,
//             displayName: userData.data()?.displayName
//           }
//         };
//       })
//     );

//     return NextResponse.json({ followRequests });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch notifications" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT and extract UID
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const currentUid = payload.uid;

    // Fetch both follow requests and notifications in parallel
    const [followRequestsSnapshot, notificationsSnapshot] = await Promise.all([
      db.collection("users")
        .doc(currentUid)
        .collection("followRequests")
        .orderBy("timestamp", "desc")
        .get(),
      db.collection("users")
        .doc(currentUid)
        .collection("notifications")
        .orderBy("timestamp", "desc")
        .get(),
    ]);

    // Get follow requests with user details
    const followRequests = await Promise.all(
      followRequestsSnapshot.docs.map(async (doc) => {
        const requestData = doc.data();
        const userDoc = await db.collection("users").doc(doc.id).get();
        const userData = userDoc.data();

        return {
          id: doc.id,
          timestamp: requestData?.timestamp || 0, // Ensure timestamp exists
          type: "follow_request",
          user: {
            uid: userDoc.id,
            username: userData?.username || "Unknown",
            profilePhotoURL: userData?.profilePhotoURL || "",
            displayName: userData?.displayName || "",
          },
        };
      })
    );

    // Get notifications
    const notifications = notificationsSnapshot.docs.map((doc) => {
      const notificationData = doc.data();
      return {
        id: doc.id,
        ...notificationData,
        timestamp: notificationData?.timestamp || 0, // Ensure timestamp exists
      };
    });

    // Combine and sort all notifications by timestamp (descending order)
    const allNotifications = [...followRequests, ...notifications].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    return NextResponse.json({ notifications: allNotifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
