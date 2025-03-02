
// // src/app/api/post/[id]/query/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextResponse, NextRequest } from "next/server";
// import { cache } from "react";
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
//   allowCommenting: boolean;
//   commentCount: number;
// }

// interface FirestoreUser {
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   isVerified: boolean;
// }

// const getPostsFromDb = cache(async (ids: string[]) => {
//   const postRefs = ids.map(id => db.collection("posts").doc(id));
//   const postDocs = await db.getAll(...postRefs);
//   return postDocs;
// });

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export async function GET( { params }: Props) {
//   try {
//     const resolvedParams = await params;
//     const { id } = resolvedParams;
    
//     const headers = {
//       "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
//       "Content-Type": "application/json",
//     };

//     // Get authentication token
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');
//     let userId: string | null = null;

//     if (token?.value) {
//       try {
//         const payload = await verifyJWT(token.value) as CustomJWTPayload;
//         if (payload.uid) {
//           userId = payload.uid;
//         }
//       } catch (error) {
//         console.error("Error verifying token:", error);
//       }
//     }

//     // Fetch post document
//     const postDocs = await getPostsFromDb([id]);
//     const postDoc = postDocs[0];

//     if (!postDoc.exists) {
//       return NextResponse.json(
//         { error: "Post not found" },
//         { status: 404, headers }
//       );
//     }

//     const postData = postDoc.data() as FirestorePost;
//     if (!postData) {
//       return NextResponse.json(
//         { error: "Post data is missing" },
//         { status: 404, headers }
//       );
//     }

//     // Fetch user document
//     const userDoc = await db.collection('users').doc(postData.uid).get();
//     const userData = userDoc.data() as FirestoreUser | undefined;

//     // Check if post is saved and liked by the current user
//     let isSaved = false;
//     let isLiked = false;
    
//     if (userId) {
//       const [savedPostDoc, likeDoc] = await Promise.all([
//         db.collection('users')
//           .doc(userId)
//           .collection('saved_posts')
//           .where('postId', '==', id)
//           .limit(1)
//           .get(),
//         db.collection('posts')
//           .doc(id)
//           .collection('likes')
//           .doc(userId)
//           .get()
//       ]);
      
//       isSaved = !savedPostDoc.empty;
//       isLiked = likeDoc.exists;
//     }

//     // Format response data
//     const responseData = {
//       uid: postData.uid,
//       id,
//       profilePhotoURL: userData?.profilePhotoURL,
//       displayName: userData?.displayName,
//       content: postData.content,
//       username: userData?.username,
//       createdAt: postData.createdAt,
//       imageURLs: postData.imageURLs || [],
//       allowCommenting: postData.allowCommenting,
//       likeCount: postData.likeCount || 0,
//       commentCount: postData.commentCount || 0,
//       isSaved,
//       isLiked,
//       isVerified: userData?.isVerified
//     };

//     return NextResponse.json(responseData, { headers });
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch post." },
//       { status: 500 }
//     );
//   }
// }


//src/app/api/post/[postId]/query/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { cache } from "react";
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
  allowCommenting: boolean;
  commentCount: number;
}

interface FirestoreUser {
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isVerified: boolean;
}

const getPostsFromDb = cache(async (postIds: string[]) => {
  const postRefs = postIds.map(postId => db.collection("posts").doc(postId));
  const postDocs = await db.getAll(...postRefs);
  return postDocs;
});

type Props = {
  params: { postId: string };
};

// Handle both GET and POST requests with the same logic
async function handleRequest(postId: string) {
  try {
    const headers = {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Content-Type": "application/json",
    };

    // Get authentication token
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    let userId: string | null = null;

    if (token?.value) {
      try {
        const payload = await verifyJWT(token.value) as CustomJWTPayload;
        if (payload.uid) {
          userId = payload.uid;
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }

    // Fetch post document
    const postDocs = await getPostsFromDb([postId]);
    const postDoc = postDocs[0];

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers }
      );
    }

    const postData = postDoc.data() as FirestorePost;
    if (!postData) {
      return NextResponse.json(
        { error: "Post data is missing" },
        { status: 404, headers }
      );
    }

    // Fetch user document
    const userDoc = await db.collection('users').doc(postData.uid).get();
    const userData = userDoc.data() as FirestoreUser | undefined;

    // Check if post is saved and liked by the current user
    let isSaved = false;
    let isLiked = false;
    
    if (userId) {
      const [savedPostDoc, likeDoc] = await Promise.all([
        db.collection('users')
          .doc(userId)
          .collection('saved_posts')
          .where('postId', '==', postId)
          .limit(1)
          .get(),
        db.collection('posts')
          .doc(postId)
          .collection('likes')
          .doc(userId)
          .get()
      ]);
      
      isSaved = !savedPostDoc.empty;
      isLiked = likeDoc.exists;
    }

    // Format response data
    const responseData = {
      uid: postData.uid,
      postId,
      profilePhotoURL: userData?.profilePhotoURL,
      displayName: userData?.displayName,
      content: postData.content,
      username: userData?.username,
      createdAt: postData.createdAt,
      imageURLs: postData.imageURLs || [],
      allowCommenting: postData.allowCommenting,
      likeCount: postData.likeCount || 0,
      commentCount: postData.commentCount || 0,
      isSaved,
      isLiked,
      isVerified: userData?.isVerified
    };

    return NextResponse.json(responseData, { headers });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }
}

// Export the GET and POST handlers that Next.js App Router requires
export async function GET(
  request: Request,
  { params }: Props
) {
  return await handleRequest(params.postId);
}

export async function POST(
  request: Request,
  { params }: Props
) {
  return await handleRequest(params.postId);
}