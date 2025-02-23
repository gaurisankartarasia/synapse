
// // app/api/post/display/query/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';

// interface FirestorePost {
//   uid: string;
//   title: string;
//   content: string;
//   imageURLs: string[];
//   createdAt: FirebaseFirestore.Timestamp;
//   likeCount: number;
//   commentCount: number;
// }

// const POSTS_PER_PAGE = 5;

// export async function GET(request: NextRequest) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const payload = await verifyJWT(token.value) as CustomJWTPayload;
    
//     if (!payload.uid) {
//       return NextResponse.json(
//         { error: 'Invalid token payload' },
//         { status: 401 }
//       );
//     }

//     const url = new URL(request.url);
//     const lastPostId = url.searchParams.get('lastPostId');
//     let query = db.collection("posts").orderBy("createdAt", "desc");

//     if (lastPostId) {
//       const lastDoc = await db.collection("posts").doc(lastPostId).get();
//       if (lastDoc.exists) {
//         query = query.startAfter(lastDoc);
//       }
//     }

//     query = query.limit(POSTS_PER_PAGE);
//     const snapshot = await query.get();
    
//     const posts = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...(doc.data() as FirestorePost),
//     }));

//     // Get unique UIDs from posts
//     const uids = [...new Set(posts.map(post => post.uid))];
    
//     // Batch fetch user data
//     const userRefs = uids.map(uid => db.collection('users').doc(uid));
//     const userSnapshots = await db.getAll(...userRefs);

//     // Create UID -> user data map
//     const uidToUserData = new Map<string, { 
//       username: string; 
//       displayName: string; 
//       profilePhotoURL: string;
//       isVerified: boolean;
//     }>();
    
//     userSnapshots.forEach((userDoc) => {
//       const userData = userDoc.data();
//       uidToUserData.set(userDoc.id, {
//         username: userData?.username || 'Unknown',
//         displayName: userData?.displayName || '',
//         profilePhotoURL: userData?.profilePhotoURL || '',
//         isVerified: userData?.isVerified || false,
//       });
//     });

//     // Fetch saved posts and likes in parallel
//     const [savedPosts, likePromises] = await Promise.all([
//       db.collection('users')
//         .doc(payload.uid)
//         .collection('saved_posts')
//         .where('postId', 'in', posts.map(post => post.id))
//         .get(),
//       Promise.all(
//         posts.map(post =>
//           db.collection('posts')
//             .doc(post.id)
//             .collection('likes')
//             .doc(payload.uid)
//             .get()
//         )
//       )
//     ]);

//     const savedPostIds = new Set(savedPosts.docs.map(doc => doc.data().postId));
//     const likedPosts = new Map(
//       posts.map((post, index) => [post.id, likePromises[index].exists])
//     );

//     // Transform posts with user data and like status
//     const formattedPosts = posts.map(post => {
//       const userData = uidToUserData.get(post.uid) || { 
//         username: 'Unknown', 
//         displayName: '', 
//         profilePhotoURL: '',
//         isVerified: false
//       };
      
//       return {
//         ...post,
//         username: userData.username,
//         displayName: userData.displayName,
//         profilePhotoURL: userData.profilePhotoURL,
//         isVerified: userData.isVerified,
//         createdAt: post.createdAt,
//         isSaved: savedPostIds.has(post.id),
//         isLiked: likedPosts.get(post.id) || false
//       };
//     });

//     return new NextResponse(JSON.stringify({ 
//       posts: formattedPosts 
//     }), {
//       headers: {
//         'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch posts." }, 
//       { status: 500 }
//     );
//   }
// }






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
  imageURLs: string[];
  createdAt: FirebaseFirestore.Timestamp;
  likeCount: number;
  commentCount: number;
  hashtags?: string[];
  allowCommenting?: boolean;
}

const POSTS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
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

    // Set up pagination
    const url = new URL(request.url);
    const lastPostId = url.searchParams.get('lastPostId');
    let query = db.collection("posts").orderBy("createdAt", "desc");

    if (lastPostId) {
      const lastDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(POSTS_PER_PAGE);
    const snapshot = await query.get();
    
    // Handle empty case
    if (snapshot.empty) {
      return new NextResponse(JSON.stringify({ 
        posts: [],
        hasMore: false
      }), {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Content-Type': 'application/json',
        },
      });
    }

    // Process posts
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
      profilePhotoURL: string;
      isVerified: boolean;
    }>();
    
    userSnapshots.forEach((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        uidToUserData.set(userDoc.id, {
          username: userData?.username || 'Unknown',
          displayName: userData?.displayName || '',
          profilePhotoURL: userData?.profilePhotoURL || '',
          isVerified: userData?.isVerified || false,
        });
      }
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

    // Create sets and maps for O(1) lookups
    const savedPostIds = new Set(savedPosts.docs.map(doc => doc.data().postId));
    const likedPosts = new Map(
      posts.map((post, index) => [post.id, likePromises[index].exists])
    );

    // Transform posts with user data and interaction states
    const formattedPosts = posts.map(post => {
      const userData = uidToUserData.get(post.uid) || { 
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
        isSaved: savedPostIds.has(post.id),
        isLiked: likedPosts.get(post.id) || false,
        allowCommenting: post.allowCommenting ?? true, // Default to true if not specified
        hashtags: post.hashtags || [],
      };
    });

    // Check if there are more posts
    const hasMore = formattedPosts.length === POSTS_PER_PAGE;

    return new NextResponse(JSON.stringify({ 
      posts: formattedPosts,
      hasMore
    }), {
      headers: {
        // 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    // Handle specific error types
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

    // Generic error
    return NextResponse.json(
      { error: "An error occurred while fetching posts. Please try again later." }, 
      { status: 500 }
    );
  }
}