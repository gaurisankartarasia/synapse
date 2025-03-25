
// app/api/follow-user/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { db, admin } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decodedToken = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const currentUid = decodedToken.uid;
    const { targetUsername } = await request.json();

    // Fetch current user data for notification
    const currentUserDoc = await db.collection("users").doc(currentUid).get();
    const currentUserData = currentUserDoc.data();

    // Fetch target user data
    const userQuery = await db
      .collection("users")
      .where("username", "==", targetUsername)
      .limit(1)
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

    if (currentUid === targetUid) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const followingRef = db
      .collection("users")
      .doc(currentUid)
      .collection("following")
      .doc(targetUid);

    const followerRef = db
      .collection("users")
      .doc(targetUid)
      .collection("followers")
      .doc(currentUid);

    const followRequestRef = db
      .collection("users")
      .doc(targetUid)
      .collection("followRequests")
      .doc(currentUid);

    const followRequestDoc = await followRequestRef.get();
    const isFollowing = (await followingRef.get()).exists;

    if (targetUserData?.isPrivate) {
      if (isFollowing) {
        // Unfollow a private user and handle follow requests
        await followingRef.delete();
        await followerRef.delete();
        if (followRequestDoc.exists) {
          await followRequestRef.delete();
        }
        
        // Delete the follow notification
        const notificationsQuery = await db
          .collection("users")
          .doc(targetUid)
          .collection("notifications")
          .where("fromUid", "==", currentUid)
          .where("type", "==", "new_follower")
          .get();
          
        const deletePromises = notificationsQuery.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        return NextResponse.json({ status: "Unfollowed" });
      } else {
        if (!followRequestDoc.exists) {
          await followRequestRef.set({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
          
          // Add notification for follow request
          const notificationRef = db
            .collection("users")
            .doc(targetUid)
            .collection("notifications")
            .doc();

          await notificationRef.set({
            type: 'follow_request',
            fromUid: currentUid,
            fromUsername: currentUserData?.username,
            fromdisplayName: currentUserData?.displayName,
            fromprofilePhotoURL: currentUserData?.profilePhotoURL || "",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            read: false
          });
          return NextResponse.json({ status: "Follow request sent" });
        } else {
          await followRequestRef.delete();
          return NextResponse.json({ status: "Follow request canceled" });
        }
      }
    } else {
      if (isFollowing) {
        // Unfollow a public user
        await followingRef.delete();
        await followerRef.delete();

        // Delete the follow notification
        const notificationsQuery = await db
          .collection("users")
          .doc(targetUid)
          .collection("notifications")
          .where("fromUid", "==", currentUid)
          .where("type", "==", "new_follower")
          .get();
          
        const deletePromises = notificationsQuery.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

      } else {
        // Follow a public user
        await followingRef.set({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        await followerRef.set({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        // Add notification for new follower
        const notificationRef = db
          .collection("users")
          .doc(targetUid)
          .collection("notifications")
          .doc();

        await notificationRef.set({
          type: 'new_follower',
          fromUid: currentUid,
          fromUsername: currentUserData?.username,
          fromdisplayName: currentUserData?.displayName,
          fromprofilePhotoURL: currentUserData?.profilePhotoURL || "",
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          read: false
        });
      }

      // Recalculate follower and following counts
      const followersSnapshot = await db
        .collection("users")
        .doc(targetUid)
        .collection("followers")
        .get();
      const followerCount = followersSnapshot.size;

      const followingSnapshot = await db
        .collection("users")
        .doc(currentUid)
        .collection("following")
        .get();
      const followingCount = followingSnapshot.size;

      await targetUserDoc.ref.update({ followerCount: followerCount });
      await db.collection("users").doc(currentUid).update({ followingCount: followingCount });

      return NextResponse.json({
        following: !isFollowing,
        followerCount: followerCount,
        followingCount: followingCount,
      });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}