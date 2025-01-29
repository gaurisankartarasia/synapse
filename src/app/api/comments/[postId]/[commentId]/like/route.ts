// app/api/comments/[postId]/[commentId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
import { cookies } from "next/headers";

export async function POST(
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
      // const userId = session.user.id;
  
      // Check if user has already liked
      const likeRef = db
        .collection('comment_likes')
        .doc(commentId)
        .collection('likes')
        .doc(payload.uid);

  
      const likeDoc = await likeRef.get();
      const commentRef = db
        .collection('post_comments')
        .doc(postId)
        .collection('comments')
        .doc(commentId);
  
      const batch = db.batch();
  
      if (likeDoc.exists) {
        // Unlike
        batch.delete(likeRef);
        batch.update(commentRef, {
          likeCount: FieldValue.increment(-1)
        });
      } else {
        // Like
        batch.set(likeRef, {
          uid: payload.uid,
          createdAt: new Date()
        });
        batch.update(commentRef, {
          likeCount: FieldValue.increment(1)
        });
      }
  
      await batch.commit();
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return NextResponse.json(
        { error: 'Failed to toggle like' },
        { status: 500 }
      );
    }
  }