
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
//             displayName: userData.data()?.displayName,
//             isVerified: userData.data()?.isVerified,
           
//           },
//            _server:"next route"
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    
    const currentUid = payload.uid;
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "all";
    
    // Fetch follow requests
    const followRequestsSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("followRequests")
      .orderBy("timestamp", "desc")
      .get();
      
    // Fetch notifications including new followers
    const notificationsSnapshot = await db
      .collection("users")
      .doc(currentUid)
      .collection("notifications")
      .orderBy("timestamp", "desc")
      .get();
    
    // Process follow requests
    const followRequests = await Promise.all(
      followRequestsSnapshot.docs.map(async (doc) => {
        const userData = await db.collection("users").doc(doc.id).get();
        return {
          id: doc.id,
          timestamp: doc.data()?.timestamp,
          user: {
            uid: userData.id,
            username: userData.data()?.username,
            profilePhotoURL: userData.data()?.profilePhotoURL,
            displayName: userData.data()?.displayName,
            isVerified: userData.data()?.isVerified,
          },
          _server: "next route"
        };
      })
    );
    
    // Process notifications
    const notifications = notificationsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        fromUid: data.fromUid,
        fromUsername: data.fromUsername,
        fromDisplayName: data.fromdisplayName, // Note: keeping original field name for compatibility
        fromProfilePhotoURL: data.fromprofilePhotoURL, // Note: keeping original field name for compatibility
        timestamp: data.timestamp,
        read: data.read,
        _server: "next route"
      };
    });
    
    // Filter based on type if specified
    let response = {};
    
    if (type === "all") {
      response = { followRequests, notifications };
    } else if (type === "followRequests") {
      response = { followRequests };
    } else if (type === "notifications") {
      response = { notifications };
    } else if (type === "newFollowers") {
      const newFollowers = notifications.filter(notification => notification.type === "new_follower");
      response = { newFollowers };
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// Add route to mark notifications as read
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    
    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    
    const currentUid = payload.uid;
    const { notificationIds } = await request.json();
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Invalid notification IDs" },
        { status: 400 }
      );
    }
    
    const updatePromises = notificationIds.map(id => 
      db.collection("users")
        .doc(currentUid)
        .collection("notifications")
        .doc(id)
        .update({ read: true })
    );
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}