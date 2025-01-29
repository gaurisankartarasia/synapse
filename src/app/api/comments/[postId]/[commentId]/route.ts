// app/api/comments/[postId]/[commentId]/route.ts
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// Delete comment
export async function DELETE(
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
    const { postId, commentId } = params;
    
    // Start a batch write
    const batch = db.batch();

    // Delete the comment
    const commentRef = db
      .collection('post_comments')
      .doc(postId)
      .collection('comments')
      .doc(commentId);

    // Delete all comment likes
    const likesRef = db
      .collection('comment_likes')
      .doc(commentId);

    // Delete all replies
    const repliesRef = db
      .collection('comment_replies')
      .doc(commentId);

    // Update post comment count
    const postRef = db.collection('posts').doc(postId);

    batch.delete(commentRef);
    batch.delete(likesRef);
    batch.delete(repliesRef);
    batch.update(postRef, {
      commentCount:FieldValue.increment(-1)
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
