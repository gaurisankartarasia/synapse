// // app/api/post/like/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { verifyAuth } from "@/utils/auth";
// import { FieldValue } from "firebase-admin/firestore";

// export async function POST(request: NextRequest) {
//   try {
//     // Verify authentication
//     const decodedToken = await verifyAuth(request);
//     const uid = decodedToken.uid;

//     const body = await request.json();
//     const { postId } = body;

//     if (!postId) {
//       return NextResponse.json({ error: "post ID is required" }, { status: 400 });
//     }

//     // Reference to the post document
//     const postRef = db.collection("posts").doc(postId);
//     const likeRef = db.collection("likes").doc(`${postId}_${uid}`);

//     // Check if user already liked the post
//     const likeDoc = await likeRef.get();

//     if (likeDoc.exists) {
//       // Unlike: Remove like document and decrement count
//       await likeRef.delete();
//       await postRef.update({
//         likes: FieldValue.increment(-1)
//       });
//       return NextResponse.json({ message: "post unliked successfully", liked: false });
//     } else {
//       // Like: Create like document and increment count
//       await likeRef.set({
//         uid,
//         postId,
//         createdAt: FieldValue.serverTimestamp()
//       });
//       await postRef.update({
//         likes: FieldValue.increment(1)
//       });
//       return NextResponse.json({ message: "post liked successfully", liked: true });
//     }
//   } catch (error) {
//     console.error("Error handling like:", error);
//     return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const decodedToken = await verifyAuth(request);
//     const userId = decodedToken.uid;
    
//     // Get postId from URL
//     const url = new URL(request.url);
//     const postId = url.searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json({ error: "post ID is required" }, { status: 400 });
//     }

//     const likeRef = db.collection("likes").doc(`${postId}_${userId}`);
//     const likeDoc = await likeRef.get();

//     return NextResponse.json({ liked: likeDoc.exists });
//   } catch (error) {
//     console.error("Error checking like status:", error);
//     return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
//   }
// }






// app/api/post/like/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/utils/auth";
import { FieldValue } from "firebase-admin/firestore";

// Store likes as a map inside the post document
// Structure: { likes: { total: number, userLikes: { [uid]: timestamp } } }
export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    const uid = decodedToken.uid;
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postRef = db.collection("posts").doc(postId);
    
    // Use a transaction to ensure atomic updates
    const result = await db.runTransaction(async (transaction) => {
      const postDoc = await transaction.get(postRef);
      
      if (!postDoc.exists) {
        throw new Error("Post not found");
      }

      const likesData = postDoc.data()?.likes || { total: 0, userLikes: {} };
      const hasLiked = likesData.userLikes?.[uid];

      if (hasLiked) {
        // Unlike: Remove user from userLikes and decrement total
        delete likesData.userLikes[uid];
        likesData.total = Math.max(0, (likesData.total || 1) - 1);
        
        transaction.update(postRef, {
          likes: likesData
        });
        
        return { liked: false, total: likesData.total };
      } else {
        // Like: Add user to userLikes and increment total
        likesData.userLikes = {
          ...likesData.userLikes,
          [uid]: FieldValue.serverTimestamp()
        };
        likesData.total = (likesData.total || 0) + 1;
        
        transaction.update(postRef, {
          likes: likesData
        });
        
        return { liked: true, total: likesData.total };
      }
    });

    return NextResponse.json({
      status: 'ok', 
    });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    const uid = decodedToken.uid;
    
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const postDoc = await db.collection("posts").doc(postId).get();
    const likesData = postDoc.data()?.likes || { total: 0, userLikes: {} };
    
    return NextResponse.json({ 
      liked: !!likesData.userLikes?.[uid],
      total: likesData.total || 0
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
}
