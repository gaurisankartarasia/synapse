

// // app/api/post/like/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { verifyAuth } from "@/utils/auth";
// import { FieldValue } from "firebase-admin/firestore";

// // Store likes as a map inside the post document
// // Structure: { likes: { total: number, userLikes: { [uid]: timestamp } } }
// export async function POST(request: NextRequest) {
//   try {
//     const decodedToken = await verifyAuth(request);
//     const uid = decodedToken.uid;
//     const { postId } = await request.json();

//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const postRef = db.collection("posts").doc(postId);
    
//     // Use a transaction to ensure atomic updates
//     const result = await db.runTransaction(async (transaction) => {
//       const postDoc = await transaction.get(postRef);
      
//       if (!postDoc.exists) {
//         throw new Error("Post not found");
//       }

//       const likesData = postDoc.data()?.likes || { total: 0, userLikes: {} };
//       const hasLiked = likesData.userLikes?.[uid];

//       if (hasLiked) {
//         // Unlike: Remove user from userLikes and decrement total
//         delete likesData.userLikes[uid];
//         likesData.total = Math.max(0, (likesData.total || 1) - 1);
        
//         transaction.update(postRef, {
//           likes: likesData
//         });
        
//         return { liked: false, total: likesData.total };
//       } else {
//         // Like: Add user to userLikes and increment total
//         likesData.userLikes = {
//           ...likesData.userLikes,
//           [uid]: FieldValue.serverTimestamp()
//         };
//         likesData.total = (likesData.total || 0) + 1;
        
//         transaction.update(postRef, {
//           likes: likesData
//         });
        
//         return { liked: true, total: likesData.total };
//       }
//     });

//     return NextResponse.json({
//       status: 'ok', 
//     });
//   } catch (error) {
//     console.error("Error handling like:", error);
//     return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const decodedToken = await verifyAuth(request);
//     const uid = decodedToken.uid;
    
//     const url = new URL(request.url);
//     const postId = url.searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const postDoc = await db.collection("posts").doc(postId).get();
//     const likesData = postDoc.data()?.likes || { total: 0, userLikes: {} };
    
//     return NextResponse.json({ 
//       liked: !!likesData.userLikes?.[uid],
//       total: likesData.total || 0
//     });
//   } catch (error) {
//     console.error("Error checking like status:", error);
//     return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
//   }
// }








// app/api/post/like/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const uid = payload.uid;
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
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const uid = payload.uid;
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