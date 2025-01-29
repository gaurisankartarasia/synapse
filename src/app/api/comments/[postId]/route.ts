// app/api/comments/[postId]/route.ts
import { db, FieldValue } from "@/lib/firebaseAdmin";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const commentsRef = db
      .collection('post_comments')
      .doc(params.postId)
      .collection('comments');

    const commentsSnapshot = await commentsRef
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const comments = [];
    const userPromises = [];

    for (const doc of commentsSnapshot.docs) {
      const commentData = doc.data();
      // Fetch user data for each comment
      userPromises.push(
        db.collection('users').doc(commentData.authorId).get()
      );
      comments.push({
        id: doc.id,
        ...commentData,
      });
    }

    // Wait for all user data to be fetched
    const userDocs = await Promise.all(userPromises);
    
    // Merge user data with comments
    const enrichedComments = comments.map((comment, index) => {
      const userData = userDocs[index].data();
      return {
        ...comment,
        authorUsername: userData?.username || 'Anonymous',
        authorPhotoURL: userData?.photoURL || null,
      };
    });

    return NextResponse.json(enrichedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
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

    const { content, authorId } = await request.json();
    
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Start a batch write
    const batch = db.batch();

    // Create new comment
    const commentRef = db
      .collection('post_comments')
      .doc(params.postId)
      .collection('comments')
      .doc();

    batch.set(commentRef, {
      authorId,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likeCount: 0,
      replyCount: 0,
    });

    // Increment post's comment count
    const postRef = db.collection('posts').doc(params.postId);
    batch.update(postRef, {
      commentCount: FieldValue.increment(1),
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}