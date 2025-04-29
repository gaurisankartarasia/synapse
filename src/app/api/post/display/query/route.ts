
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
  isArchived?: boolean;
}

const POSTS_PER_PAGE = 5;

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

    // Get the list of users that the current user follows
    const followingSnapshot = await db
      .collection('users')
      .doc(payload.uid)
      .collection('following')
      .get();

    // Extract the UIDs of followed users and add the current user's UID
    const followedUserIds = [...followingSnapshot.docs.map(doc => doc.id), payload.uid];
    
    // Set up pagination
    const url = new URL(request.url);
    const lastPostId = url.searchParams.get('lastPostId');
    let query = db.collection("posts")
      .where("creator_uid", "in", followedUserIds)
      .where("isArchived", "!=", true)
      .orderBy("isArchived")
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

    // Get user data in parallel
    const uids = [...new Set(posts.map(post => post.creator_uid))];
    const userRefs = uids.map(uid => db.collection('users').doc(uid));
    const [userSnapshots, savedPosts, likeDocs] = await Promise.all([
      db.getAll(...userRefs),
      db.collection('users')
        .doc(payload.uid)
        .collection('saved_posts')
        .where('postId', 'in', posts.map(post => post.postId))
        .get(),
      Promise.all(
        posts.map(post =>
          db.collection('posts')
            .doc(post.postId)
            .collection('likes')
            .doc(payload.uid)
            .get()
        )
      )
    ]);

    const uidToUserData = new Map(
      userSnapshots.map(doc => [
        doc.id,
        doc.exists ? doc.data() : { 
          username: 'Unknown', 
          displayName: '', 
          profilePhotoURL: '',
          isVerified: false 
        }
      ])
    );

    const savedPostIds = new Set(savedPosts.docs.map(doc => doc.data().postId));
    const likedPosts = new Map(posts.map((post, i) => [post.postId, likeDocs[i].exists]));

    const formattedPosts = posts.map(post => {
      const userData = uidToUserData.get(post.creator_uid) || { 
        username: 'Unknown', 
        displayName: '', 
        profilePhotoURL: '',
        isVerified: false 
      };
      
      return {
        ...post,
        username: userData.username,
        displayName: userData.displayName,
        profilePhotoURL: userData.profilePhotoURL,
        isVerified: userData.isVerified,
        createdAt: post.createdAt,
        isSaved: savedPostIds.has(post.postId),
        isLiked: likedPosts.get(post.postId) || false,
        allowCommenting: post.allowCommenting ?? true,
        hashtags: post.hashtags || [],
        isOwnPost: post.creator_uid === payload.uid 
      };
    });

    return NextResponse.json({ 
      posts: formattedPosts,
      hasMore: formattedPosts.length === POSTS_PER_PAGE
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Token')) {
        return NextResponse.json(
          { error: "Authentication failed. Please log in again." },
          { status: 401 }
        );
      }
      
      if (error.message.includes('Permission')) {
        return NextResponse.json(
          { error: "You don't have permission to access these posts." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "An error occurred while fetching posts. Please try again later." }, 
      { status: 500 }
    );
  }
}