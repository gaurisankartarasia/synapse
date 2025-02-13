
//  // app/api/post/comments/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";
// import { FieldValue } from "firebase-admin/firestore";

// export async function GET(request: NextRequest) {
//   try {
//     // Extract postId from query parameters
//     const { searchParams } = new URL(request.url);
//     const postId = searchParams.get('postId');

//     if (!postId) {
//       return NextResponse.json(
//         { error: "Post ID is required" },
//         { status: 400 }
//       );
//     }

//     // Fetch comments for the post
//     const commentsSnapshot = await db
//       .collection("posts")
//       .doc(postId)
//       .collection("comments")
//       .orderBy("createdAt", "desc")
//       .get();

//     const comments = await Promise.all(
//       commentsSnapshot.docs.map(async (commentDoc) => {
//         const commentData = commentDoc.data();
//         const commentId = commentDoc.id;

//         // Fetch the username's username from the users collection using authorId
//         const userDoc = await db.collection("users").doc(commentData.uid).get();
//         const username = userDoc.exists ? userDoc.data()?.username : null;
//         const profilePhotoURL = userDoc.exists ? userDoc.data()?.profilePhotoURL : null;
//         const displayName = userDoc.exists ? userDoc.data()?.displayName : null;
//         const isVerified = userDoc.exists ? userDoc.data()?.verified : null;
//         const isPrivate = userDoc.exists ? userDoc.data()?.private : null;

//         // Fetch replies for the comment
//         const repliesSnapshot = await db
//           .collection("posts")
//           .doc(postId)
//           .collection("comments")
//           .doc(commentId)
//           .collection("replies")
//           .orderBy("createdAt", "asc")
//           .get();

//         const replies = await Promise.all(
//           repliesSnapshot.docs.map(async (replyDoc) => {
//             const replyData = replyDoc.data();
//             const replyId = replyDoc.id;

//             // Fetch the username's username for each reply
//             const replyUserDoc = await db.collection("users").doc(replyData.uid).get();
//             const username = replyUserDoc.exists ? replyUserDoc.data()?.username : null;
//             const profilePhotoURL = userDoc.exists ? replyUserDoc.data()?.profilePhotoURL : null;
//             const displayName = userDoc.exists ? replyUserDoc.data()?.displayName : null;
//             const isVerified = userDoc.exists ? replyUserDoc.data()?.isVerified : null;
//             const isPrivate = userDoc.exists ? replyUserDoc.data()?.isPrivate : null;

//             // Fetch likes for the reply
//             const likesSnapshot = await db
//               .collection("posts")
//               .doc(postId)
//               .collection("comments")
//               .doc(commentId)
//               .collection("replies")
//               .doc(replyId)
//               .collection("likes")
//               .get();

//             return {
//               id: replyId,
//               uid: replyData.uid,
//               user:{
//                 uid: replyData.uid,
//                 username: username, 
//               profilePhotoURL:profilePhotoURL,
//               displayName: displayName,
//               isVerified : isVerified,
//               isPrivate : isPrivate,
            
//               },
//               content: replyData.content,
//               createdAt: replyData.createdAt,
//               likes: replyData.likes || 0,
//               likedBy: likesSnapshot.docs.map((doc) => doc.id),
//             };
//           })
//         );

//         return {
//           id: commentId,
//           uid: commentData.uid,
//           content: commentData.content,
//           user:{
//             uid: commentData.uid,
//             username: username, 
//           profilePhotoURL:profilePhotoURL,
//           displayName: displayName,
//           isVerified : isVerified,
//           isPrivate : isPrivate,
        
//           },
//           createdAt: commentData.createdAt,
//           likes: commentData.likes || 0,
//           likedBy: commentData.likedBy || [],
//           replies,
//         };
//       })
//     );

//     return NextResponse.json({ comments }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching comments and replies:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch comments" },
//       { status: 500 }
//     );
//   }
// }



// export async function POST(request: NextRequest) {
//   try {
//     // Get token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Verify token and type assert the payload
//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const { postId, content } = await request.json();
//     if (!postId || !content) {
//       return NextResponse.json(
//         { error: "Post ID and content are required" },
//         { status: 400 }
//       );
//     }

//     // Fetch the username from the users collection
//     // const userDoc = await db.collection("users").doc(payload.uid).get();

//     const postRef = db.collection("posts").doc(postId);
//     const commentsRef = postRef.collection("comments");

//     // Create a new document with an auto-generated ID
//     const newCommentRef = commentsRef.doc();
//     const commentId = newCommentRef.id; // Get the auto-generated ID

//     // Prepare the new comment
//     const newComment = {
//       id: commentId,
//       uid: payload.uid,
//       content,
//       createdAt: FieldValue.serverTimestamp(),
//       likes: 0,
//       likedBy: [],
//     };

//     // Start a write batch
//     const batch = db.batch();
//     batch.set(newCommentRef, newComment);
//     batch.update(postRef, {
//       commentCount: FieldValue.increment(1),
//     });

//     // Commit the batch write
//     await batch.commit();

//     // Fetch the saved comment with the actual timestamp
//     const savedComment = await newCommentRef.get();
//     const commentData = savedComment.data();

//     return NextResponse.json(commentData, { status: 201 });
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
//   }
// }










 // app/api/post/comments/route.ts
 import { NextRequest, NextResponse } from "next/server";
 import { db } from "@/lib/firebaseAdmin";
 import { cookies } from "next/headers";
 import { verifyJWT } from "@/lib/jwt";
 import { CustomJWTPayload } from "@/types/auth";
 import { FieldValue } from "firebase-admin/firestore";
 
 export async function GET(request: NextRequest) {
   try {
     // Extract postId from query parameters
     const { searchParams } = new URL(request.url);
     const postId = searchParams.get('postId');
 
     if (!postId) {
       return NextResponse.json(
         { error: "Post ID is required" },
         { status: 400 }
       );
     }
 
     // Fetch comments for the post
     const commentsSnapshot = await db
       .collection("posts")
       .doc(postId)
       .collection("comments")
       .orderBy("createdAt", "desc")
       .get();
 
     const comments = await Promise.all(
       commentsSnapshot.docs.map(async (commentDoc) => {
         const commentData = commentDoc.data();
         const commentId = commentDoc.id;
 
         // Fetch the username's username from the users collection using authorId
         const userDoc = await db.collection("users").doc(commentData.uid).get();
         const username = userDoc.exists ? userDoc.data()?.username : null;
         const profilePhotoURL = userDoc.exists ? userDoc.data()?.profilePhotoURL : null;
         const displayName = userDoc.exists ? userDoc.data()?.displayName : null;
         const isVerified = userDoc.exists ? userDoc.data()?.isVerified : null;
         const isPrivate = userDoc.exists ? userDoc.data()?.isPrivate : null;
 
         // Fetch replies for the comment
         const repliesSnapshot = await db
           .collection("posts")
           .doc(postId)
           .collection("comments")
           .doc(commentId)
           .collection("replies")
           .orderBy("createdAt", "asc")
           .get();
 
         const replies = await Promise.all(
           repliesSnapshot.docs.map(async (replyDoc) => {
             const replyData = replyDoc.data();
             const replyId = replyDoc.id;
 
             // Fetch the username's username for each reply
             const replyUserDoc = await db.collection("users").doc(replyData.uid).get();
             const username = replyUserDoc.exists ? replyUserDoc.data()?.username : null;
             const profilePhotoURL = userDoc.exists ? replyUserDoc.data()?.profilePhotoURL : null;
             const displayName = userDoc.exists ? replyUserDoc.data()?.displayName : null;
             const isVerified = userDoc.exists ? replyUserDoc.data()?.isVerified : null;
             const isPrivate = userDoc.exists ? replyUserDoc.data()?.isPrivate : null;
 
             // Fetch likes for the reply
             const likesSnapshot = await db
               .collection("posts")
               .doc(postId)
               .collection("comments")
               .doc(commentId)
               .collection("replies")
               .doc(replyId)
               .collection("likes")
               .get();
 
             return {
               id: replyId,
               uid: replyData.uid,
               user:{
                 uid: replyData.uid,
                 username: username, 
               profilePhotoURL:profilePhotoURL,
               displayName: displayName,
               isVerified : isVerified,
               isPrivate : isPrivate,
             
               },
               content: replyData.content,
               createdAt: replyData.createdAt,
               likes: replyData.likes || 0,
               likedBy: likesSnapshot.docs.map((doc) => doc.id),
             };
           })
         );
 
         return {
           id: commentId,
           uid: commentData.uid,
           content: commentData.content,
           user:{
             uid: commentData.uid,
             username: username, 
           profilePhotoURL:profilePhotoURL,
           displayName: displayName,
           isVerified : isVerified,
           isPrivate : isPrivate,
         
           },
           createdAt: commentData.createdAt,
           likes: commentData.likes || 0,
           likedBy: commentData.likedBy || [],
           replies,
         };
       })
     );
 
     return NextResponse.json({ comments }, { status: 200 });
   } catch (error) {
     console.error("Error fetching comments and replies:", error);
     return NextResponse.json(
       { error: "Failed to fetch comments" },
       { status: 500 }
     );
   }
 }
 
 
 
//  export async function POST(request: NextRequest) {
//    try {
//      // Get token from cookies
//      const cookieStore = await cookies();
//      const token = cookieStore.get("token");
 
//      if (!token?.value) {
//        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//      }
 
//      // Verify token and type assert the payload
//      const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
 
//      if (!payload.uid) {
//        return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//      }
 
//      const { postId, content } = await request.json();
//      if (!postId || !content) {
//        return NextResponse.json(
//          { error: "Post ID and content are required" },
//          { status: 400 }
//        );
//      }
 
//      // Fetch the username from the users collection
//      // const userDoc = await db.collection("users").doc(payload.uid).get();
 
//      const postRef = db.collection("posts").doc(postId);
//      const commentsRef = postRef.collection("comments");
 
//      // Create a new document with an auto-generated ID
//      const newCommentRef = commentsRef.doc();
//      const commentId = newCommentRef.id; // Get the auto-generated ID
 
//      // Prepare the new comment
//      const newComment = {
//        id: commentId,
//        uid: payload.uid,
//        content,
//        createdAt: FieldValue.serverTimestamp(),
//        likes: 0,
//        likedBy: [],
//      };
 
//      // Start a write batch
//      const batch = db.batch();
//      batch.set(newCommentRef, newComment);
//      batch.update(postRef, {
//        commentCount: FieldValue.increment(1),
//      });
 
//      // Commit the batch write
//      await batch.commit();
 
//      // Fetch the saved comment with the actual timestamp
//      const savedComment = await newCommentRef.get();
//      const commentData = savedComment.data();
 
//      return NextResponse.json(commentData, { status: 201 });
//    } catch (error) {
//      console.error("Error adding comment:", error);
//      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
//    }
//  }
 
 
 
// app/api/post/comments/route.ts
export async function POST(request: NextRequest) {
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

    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json(
        { error: "Post ID and content are required" },
        { status: 400 }
      );
    }

    // Fetch the user data first
    const userDoc = await db.collection("users").doc(payload.uid).get();
    const userData = userDoc.data();

    const postRef = db.collection("posts").doc(postId);
    const commentsRef = postRef.collection("comments");

    const newCommentRef = commentsRef.doc();
    const commentId = newCommentRef.id;

    const newComment = {
      id: commentId,
      uid: payload.uid,
      content,
      createdAt: FieldValue.serverTimestamp(),
      likes: 0,
      likedBy: [],
    };

    const batch = db.batch();
    batch.set(newCommentRef, newComment);
    batch.update(postRef, {
      commentCount: FieldValue.increment(1),
    });

    await batch.commit();

    // Fetch the saved comment to get the actual timestamp
    const savedComment = await newCommentRef.get();
    const commentData = savedComment.data();

    // Return the comment with user data
    return NextResponse.json({
      ...commentData,
      user: {
        uid: payload.uid,
        username: userData?.username,
        profilePhotoURL: userData?.profilePhotoURL,
        displayName: userData?.displayName,
        isVerified: userData?.isVerified,
        isPrivate: userData?.isPrivate,
      },
      replies: [],
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
 
 
 
 
 
 
 