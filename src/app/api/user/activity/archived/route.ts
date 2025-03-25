import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

interface FirestorePost {
  creator_uid: string;
  title: string;
  content: string;
  imageURLs: string[];
  createdAt: FirebaseFirestore.Timestamp;
  likeCount: number;
  commentCount: number;
  hashtags?: string[];
  allowCommenting?: boolean;
  isArchived: boolean;
}

const POSTS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token.value) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Set up pagination
    const url = new URL(request.url);
    const lastPostId = url.searchParams.get('lastPostId');
    
    let query = db.collection("posts")
      .where("creator_uid", "==", payload.uid)
      .where("isArchived", "==", true)
      .orderBy("createdAt", "desc");

    if (lastPostId) {
      const lastDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.limit(POSTS_PER_PAGE).get();
    
    if (snapshot.empty) {
      return NextResponse.json({ posts: [], hasMore: false });
    }

    const posts = snapshot.docs.map((doc) => ({
      postId: doc.id,
      ...(doc.data() as FirestorePost),
    }));

    // Get user data
    const userDoc = await db.collection('users').doc(payload.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {
      username: 'Unknown',
      displayName: '',
      profilePhotoURL: '',
      isVerified: false
    };

    const formattedPosts = posts.map(post => ({
      ...post,
      username: userData?.username,
      displayName: userData?.displayName,
      profilePhotoURL: userData?.profilePhotoURL,
      isVerified: userData?.isVerified,
      createdAt: post.createdAt,
      allowCommenting: post.allowCommenting ?? true,
      hashtags: post.hashtags || [],
    }));

    return NextResponse.json({ 
      posts: formattedPosts,
      hasMore: formattedPosts.length === POSTS_PER_PAGE
    });
  } catch (error) {
    console.error("Error fetching archived posts:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Token')) {
        return NextResponse.json(
          { error: "Authentication failed. Please log in again." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "An error occurred while fetching archived posts. Please try again later." }, 
      { status: 500 }
    );
  }
}