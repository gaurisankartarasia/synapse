
// app/api/post/display/query/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

interface FirestorePost {
  uid: string;
  title: string;
  content: string;
  imageUrls: string[];
  created_at: FirebaseFirestore.Timestamp;
  likeCount: number;
  commentCount: number;
}

const POSTS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
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

    const url = new URL(request.url);
    const lastPostId = url.searchParams.get('lastPostId');
    let query = db.collection("posts").orderBy("created_at", "desc");

    if (lastPostId) {
      const lastDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(POSTS_PER_PAGE);
    const snapshot = await query.get();
    
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FirestorePost),
    }));

    // Get unique UIDs from posts
    const uids = [...new Set(posts.map(post => post.uid))];
    
    // Batch fetch user data
    const userRefs = uids.map(uid => db.collection('users').doc(uid));
    const userSnapshots = await db.getAll(...userRefs);

    // Create UID -> user data map
    const uidToUserData = new Map<string, { 
      username: string; 
      displayName: string; 
      photoURL: string;
      is_verified: boolean;
    }>();
    
    userSnapshots.forEach((userDoc) => {
      const userData = userDoc.data();
      uidToUserData.set(userDoc.id, {
        username: userData?.username || 'Unknown',
        displayName: userData?.displayName || '',
        photoURL: userData?.photoURL || '',
        is_verified: userData?.is_verified || false,
      });
    });

    // Fetch saved posts and likes in parallel
    const [savedPosts, likePromises] = await Promise.all([
      db.collection('users')
        .doc(payload.uid)
        .collection('saved_posts')
        .where('postId', 'in', posts.map(post => post.id))
        .get(),
      Promise.all(
        posts.map(post =>
          db.collection('posts')
            .doc(post.id)
            .collection('likes')
            .doc(payload.uid)
            .get()
        )
      )
    ]);

    const savedPostIds = new Set(savedPosts.docs.map(doc => doc.data().postId));
    const likedPosts = new Map(
      posts.map((post, index) => [post.id, likePromises[index].exists])
    );

    // Transform posts with user data and like status
    const formattedPosts = posts.map(post => {
      const userData = uidToUserData.get(post.uid) || { 
        username: 'Unknown', 
        displayName: '', 
        photoURL: '',
        is_verified: false
      };
      
      return {
        ...post,
        author: userData.username,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        is_verified: userData.is_verified,
        created_at: post.created_at,
        is_saved: savedPostIds.has(post.id),
        is_liked: likedPosts.get(post.id) || false
      };
    });

    return new NextResponse(JSON.stringify({ 
      posts: formattedPosts 
    }), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts." }, 
      { status: 500 }
    );
  }
}
