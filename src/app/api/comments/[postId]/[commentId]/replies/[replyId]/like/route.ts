// app/api/comments/[postId]/[commentId]/replies/[replyId]/like/route.ts
import {db, FieldValue} from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
import { cookies } from 'next/headers';


export async function POST(
    request: Request,
    { params }: { params: { postId: string; commentId: string; replyId: string } }
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
  
      const { replyId } = params;
      const uid = payload.uid;
  
      // Check if user has already liked
      const likeRef = db
        .collection('reply_likes')
        .doc(replyId)
        .collection('likes')
        .doc(uid);
  
      const likeDoc = await likeRef.get();
      const replyRef = db
        .collection('comment_replies')
        .doc(params.commentId)
        .collection('replies')
        .doc(replyId);
  
      const batch = db.batch();
  
      if (likeDoc.exists) {
        // Unlike
        batch.delete(likeRef);
        batch.update(replyRef, {
          likeCount: FieldValue.increment(-1)
        });
      } else {
        // Like
        batch.set(likeRef, {
          uid,
          createdAt: new Date()
        });
        batch.update(replyRef, {
          likeCount: FieldValue.increment(1)
        });
      }
  
      await batch.commit();
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error toggling reply like:', error);
      return NextResponse.json(
        { error: 'Failed to toggle like' },
        { status: 500 }
      );
    }
  }