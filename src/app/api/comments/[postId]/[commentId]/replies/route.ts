// // app/api/comments/[postId]/[commentId]/replies/route.ts
// import { NextResponse, NextRequest } from "next/server";
// import{db, FieldValue} from "@/lib/firebaseAdmin";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";

// export async function GET(
//     request: NextRequest,
//     { params }: { params: { postId: string; commentId: string } }
//   ) {
//     try {


//  const cookieStore = await cookies();
//          const token = cookieStore.get('token');
     
//          if (!token?.value) {
//            return NextResponse.json(
//              { error: 'Unauthorized' },
//              { status: 401 }
//            );
//          }

//           const payload = await verifyJWT(token.value) as CustomJWTPayload;
             
//              if (!payload.uid) {
//                return NextResponse.json(
//                  { error: 'Invalid token payload' },
//                  { status: 401 }
//                );
//              }

//       const { postId, commentId } = params;
      
//       const repliesRef = db
//         .collection('comment_replies')
//         .doc(commentId)
//         .collection('replies')
//         .orderBy('createdAt', 'asc');
  
//       const repliesSnapshot = await repliesRef.get();
      
//       const replies = [];
//       const userPromises = [];
  
//       for (const doc of repliesSnapshot.docs) {
//         const replyData = doc.data();
//         userPromises.push(
//           db.collection('users').doc(replyData.authorId).get()
//         );
//         replies.push({
//           id: doc.id,
//           ...replyData
//         });
//       }
  
//       // Get user data for all replies
//       const userDocs = await Promise.all(userPromises);
      
//       // Get like status for authenticated user
//       // const session = await getServerSession(authOptions);
//       let userLikes = new Set();
      
//       if (token) {
//         const uid = payload.uid;
//         const likePromises = replies.map(reply =>
//           db
//             .collection('reply_likes')
//             .doc(reply.id)
//             .collection('likes')
//             .doc(uid)
//             .get()
//         );
//         const likeDocs = await Promise.all(likePromises);
//         userLikes = new Set(
//           likeDocs
//             .map((doc, index) => doc.exists ? replies[index].id : null)
//             .filter(Boolean)
//         );
//       }
  
//       // Combine all data
//       const enrichedReplies = replies.map((reply, index) => {
//         const userData = userDocs[index].data();
//         return {
//           ...reply,
//           authorUsername: userData?.username || 'Anonymous',
//           authorPhotoURL: userData?.photoURL || null,
//           isLiked: userLikes.has(reply.id)
//         };
//       });
  
//       return NextResponse.json(enrichedReplies);
//     } catch (error) {
//       console.error('Error fetching replies:', error);
//       return NextResponse.json(
//         { error: 'Failed to fetch replies' },
//         { status: 500 }
//       );
//     }
//   }
  
//   export async function POST(
//     request: Request,
//     { params }: { params: { postId: string; commentId: string } }
//   ) {
//     try {
//       const cookieStore = await cookies();
//          const token = cookieStore.get('token');
     
//          if (!token?.value) {
//            return NextResponse.json(
//              { error: 'Unauthorized' },
//              { status: 401 }
//            );
//          }

//           const payload = await verifyJWT(token.value) as CustomJWTPayload;
             
//              if (!payload.uid) {
//                return NextResponse.json(
//                  { error: 'Invalid token payload' },
//                  { status: 401 }
//                );
//              }

//       const { content, authorId } = await request.json();
//       const { postId, commentId } = params;
      
//       if (!content?.trim()) {
//         return NextResponse.json(
//           { error: 'Reply content is required' },
//           { status: 400 }
//         );
//       }
  
//       const batch = db.batch();
  
//       // Create reply
//       const replyRef = db
//         .collection('comment_replies')
//         .doc(commentId)
//         .collection('replies')
//         .doc();
  
//       batch.set(replyRef, {
//         authorId,
//         content: content.trim(),
//         createdAt: FieldValue.serverTimestamp,
//         updatedAt: FieldValue.serverTimestamp,
//         likeCount: 0
//       });
  
//       // Update comment reply count
//       const commentRef = db
//         .collection('post_comments')
//         .doc(postId)
//         .collection('comments')
//         .doc(commentId);
  
//       batch.update(commentRef, {
//         replyCount: FieldValue.increment(1)
//       });
  
//       await batch.commit();
  
//       return NextResponse.json({ success: true });
//     } catch (error) {
//       console.error('Error creating reply:', error);
//       return NextResponse.json(
//         { error: 'Failed to create reply' },
//         { status: 500 }
//       );
//     }
//   }
  



// app/api/comments/[postId]/[commentId]/replies/route.ts
import { NextResponse, NextRequest } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";
import { Timestamp } from 'firebase-admin/firestore';

// Interface for raw reply data from Firestore
interface FirestoreReply {
  authorId: string;
  content: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  likeCount: number;
}

interface FirestoreUser {
  username: string;
  photoURL: string | null;
}

interface EnrichedReply extends FirestoreReply {
  id: string;
  authorUsername: string;
  authorPhotoURL: string | null;
  isLiked: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;

    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { postId, commentId } = params;
    
    const repliesRef = db
      .collection('comment_replies')
      .doc(commentId)
      .collection('replies')
      .orderBy('createdAt', 'asc');

    const repliesSnapshot = await repliesRef.get();
    
    const replies: Array<FirestoreReply & { id: string }> = [];
    const userPromises: Promise<FirebaseFirestore.DocumentSnapshot>[] = [];

    for (const doc of repliesSnapshot.docs) {
      const replyData = doc.data() as FirestoreReply;
      userPromises.push(
        db.collection('users').doc(replyData.authorId).get()
      );
      replies.push({
        id: doc.id,
        ...replyData
      });
    }

    // Get user data for all replies
    const userDocs = await Promise.all(userPromises);
    
    let userLikes = new Set<string>();
    
    if (token) {
      const uid = payload.uid;
      const likePromises = replies.map(reply =>
        db
          .collection('reply_likes')
          .doc(reply.id)
          .collection('likes')
          .doc(uid)
          .get()
      );
      const likeDocs = await Promise.all(likePromises);
      userLikes = new Set(
        likeDocs
          .map((doc, index) => doc.exists ? replies[index].id : null)
          .filter((id): id is string => id !== null)
      );
    }

    // Combine all data
    const enrichedReplies: EnrichedReply[] = replies.map((reply, index) => {
      const userData = userDocs[index].data() as FirestoreUser | undefined;
      return {
        ...reply,
        authorUsername: userData?.username || 'Anonymous',
        authorPhotoURL: userData?.photoURL || null,
        isLiked: userLikes.has(reply.id)
      };
    });

    return NextResponse.json(enrichedReplies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}

interface CreateReplyBody {
  content: string;
  authorId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
        
    if (!payload.uid) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      );
    }

    const { content, authorId } = await request.json() as CreateReplyBody;
    const { postId, commentId } = params;
    
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      );
    }

    const batch = db.batch();

    // Create reply
    const replyRef = db
      .collection('comment_replies')
      .doc(commentId)
      .collection('replies')
      .doc();

    const now = Timestamp.now();
    
    const newReply: FirestoreReply = {
      authorId,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
      likeCount: 0
    };

    batch.set(replyRef, newReply);

    // Update comment reply count
    const commentRef = db
      .collection('post_comments')
      .doc(postId)
      .collection('comments')
      .doc(commentId);

    batch.update(commentRef, {
      replyCount: FieldValue.increment(1)
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}