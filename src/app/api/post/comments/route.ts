
// // app/api/post/comments/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';
// import { FieldValue } from "firebase-admin/firestore";

// export async function GET(request: NextRequest) {
//   try {
//     const postId = request.nextUrl.searchParams.get("postId");
//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const postRef = db.collection("posts").doc(postId);
//     const postDocs = await db.getAll(postRef);

//     if (postDocs.length === 0 || !postDocs[0].exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const comments = postDocs[0].data()?.comments || [];
//     return NextResponse.json({ comments }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Verify token and type assert the payload
//     const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
//     if (!payload.uid) {
//       return NextResponse.json(
//         { error: 'Invalid token payload' },
//         { status: 401 }
//       );
//     }

//     const { postId, content } = await request.json();
//     if (!postId || !content) {
//       return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
//     }

//     // Fetch the username from the users collection
//     const userDoc = await db.collection("users").doc(payload.uid).get();
//     const username = userDoc.exists ? userDoc.data()?.username : null;

//     const postRef = db.collection("posts").doc(postId);

//     // Prepare the new comment
//     const newComment = {
//       id: Date.now().toString(),
//       authorId: payload.uid,
//       content,
//       author: username || payload.uid,
//       createdAt: FieldValue.serverTimestamp(),
//       likes: 0,
//       likedBy: []
//     };

//     // Start a write batch for more flexibility
//     const batch = db.batch();
//     batch.update(postRef, {
//       comments: FieldValue.arrayUnion(newComment),
//       commentCount: FieldValue.increment(1)
//     });

//     // Commit the batch write
//     await batch.commit();

//     return NextResponse.json(newComment, { status: 201 });
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
//   }
// }







// // app/api/post/comments/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db, FieldValue, Timestamp } from "@/lib/firebaseAdmin";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';

// export async function GET(request: NextRequest) {
//   try {
//     const postId = request.nextUrl.searchParams.get("postId");
//     if (!postId) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const postRef = db.collection("posts").doc(postId);
//     const postDocs = await db.getAll(postRef);

//     if (postDocs.length === 0 || !postDocs[0].exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     const comments = postDocs[0].data()?.comments || [];
//     return NextResponse.json({ comments }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       console.error('No token found in cookies');
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Verify token and type assert the payload
//     let payload;
//     try {
//       payload = await verifyJWT(token.value) as CustomJWTPayload;
//     } catch (verifyError) {
//       console.error('Token verification failed:', verifyError);
//       return NextResponse.json(
//         { error: 'Invalid token' },
//         { status: 401 }
//       );
//     }
    
//     if (!payload.uid) {
//       console.error('No user ID in token payload');
//       return NextResponse.json(
//         { error: 'Invalid token payload' },
//         { status: 401 }
//       );
//     }

//     const { postId, content } = await request.json();
//     if (!postId || !content) {
//       return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
//     }

//     // Validate content length if needed
//     if (content.trim().length === 0) {
//       return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
//     }

//     // Fetch the username from the users collection
//     const userDoc = await db.collection("users").doc(payload.uid).get();
//     if (!userDoc.exists) {
//       console.error(`User document not found for ID: ${payload.uid}`);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const username = userDoc.data()?.username;

//     const postRef = db.collection("posts").doc(postId);
//     const postDoc = await postRef.get();

//     if (!postDoc.exists) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     // Prepare the new comment
//     const newComment = {
//       id: Date.now().toString(),
//       authorId: payload.uid,
//       content,
//       author: username || payload.uid,
//       createdAt:  Timestamp.now(),
//       likes: 0,
//       likedBy: []
//     };

//     // Start a write batch for more flexibility
//     const batch = db.batch();
//     batch.update(postRef, {
//       comments: FieldValue.arrayUnion(newComment),
//       commentCount: FieldValue.increment(1)
//     });

//     // Commit the batch write
//     await batch.commit();

//     return NextResponse.json(newComment, { status: 201 });
//   } catch (error) {
//     console.error("Unexpected error adding comment:", error);
//     return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
//   }
// } 








// app/api/post/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, Timestamp } from "@/lib/firebaseAdmin";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Check if post exists
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get comments from the subcollection
    const commentsSnapshot = await postRef.collection('comments')
      .orderBy('createdAt', 'desc')
      .get();

    const comments = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      console.error('No token found in cookies');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and type assert the payload
    let payload;
    try {
      payload = await verifyJWT(token.value) as CustomJWTPayload;
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    if (!payload.uid) {
      console.error('No user ID in token payload');
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
    }

    // Validate content length if needed
    if (content.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    // Fetch the username from the users collection
    const userDoc = await db.collection("users").doc(payload.uid).get();
    if (!userDoc.exists) {
      console.error(`User document not found for ID: ${payload.uid}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const username = userDoc.data()?.username;

    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Start a batch write
    const batch = db.batch();

    // Create a new comment document in the subcollection
    const newCommentRef = postRef.collection('comments').doc();
    const newComment = {
      authorId: payload.uid,
      content,
      author: username || payload.uid,
      createdAt: Timestamp.now(),
      likes: 0,
      likedBy: []
    };

    // Add the comment to the subcollection
    batch.set(newCommentRef, newComment);

    // Update the comment count in the post document
    batch.update(postRef, {
      commentCount: (postDoc.data()?.commentCount || 0) + 1
    });

    // Commit the batch write
    await batch.commit();

    return NextResponse.json({
      id: newCommentRef.id,
      ...newComment
    }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}