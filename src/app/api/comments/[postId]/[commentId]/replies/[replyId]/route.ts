// app/api/comments/[postId]/[commentId]/replies/[replyId]/route.ts
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";



export async function DELETE(
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
      const { postId, commentId, replyId } = params;
  
      const batch = db.batch();
  
      // Delete reply
      const replyRef = db
        .collection('comment_replies')
        .doc(commentId)
        .collection('replies')
        .doc(replyId);
  
      // Delete reply likes
      const likesRef = db
        .collection('reply_likes')
        .doc(replyId);
  
      // Update comment reply count
      const commentRef = db
        .collection('post_comments')
        .doc(postId)
        .collection('comments')
        .doc(commentId);
  
      batch.delete(replyRef);
      batch.delete(likesRef);
      batch.update(commentRef, {
        replyCount: FieldValue.increment(-1)
      });
  
      await batch.commit();
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting reply:', error);
      return NextResponse.json(
        { error: 'Failed to delete reply' },
        { status: 500 }
      );
    }
  }