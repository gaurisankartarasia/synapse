// //src/app/api/post/[id]/route.ts
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
//   imageUrls: string[];
//   createdAt: FirebaseFirestore.Timestamp;
//   likeCount: number;
//   allowCommenting: boolean;
//   commentCount: number;
// }

// interface FirestoreUser {
//   username: string;
//   displayName: string;
//   photoURL: string;
//   is_verified: boolean;
// }

// // Cache the batch read operation for the posts
// const getPostsFromDb = cache(async (ids: string[]) => {
//   const postRefs = ids.map(id => db.collection("posts").doc(id));
//   const postDocs = await db.getAll(...postRefs);
//   return postDocs;
// });

// type Props = {
//   params: Promise<{ id: string }>;
// };

// export async function GET(request: NextRequest, { params }: Props) {
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
//         // Continue without user authentication
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
    
//     // Get user data or default values
//     const authorName = userData?.username;
//     const displayName = userData?.displayName;
//     const photoURL = userData?.photoURL;
//     const is_verified = userData?.is_verified;

//     // Check if post is saved by the current user
//     let is_saved = false;
//     if (userId) {
//       const savedPostDoc = await db.collection('users')
//         .doc(userId)
//         .collection('saved_posts')
//         .where('postId', '==', id)
//         .limit(1)
//         .get();
      
//       is_saved = !savedPostDoc.empty;
//     }

//     // Format response data
//     const responseData = {
//       uid: postData.uid,
//       id,
//       photoURL,
//       displayName,
//       content: postData.content,
//       author: authorName,
//       createdAt: postData.createdAt,
//       imageUrls: postData.imageUrls || [],
//       allowCommenting: postData.allowCommenting,
//       likeCount: postData.likeCount || null,
//       commentCount: postData.commentCount || 0,
//       is_saved,
//       is_verified
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










// src/app/api/post/[id]/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse, NextRequest } from "next/server";
import { cache } from "react";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';

interface FirestorePost {
  uid: string;
  title: string;
  content: string;
  imageUrls: string[];
  createdAt: FirebaseFirestore.Timestamp;
  likeCount: number;
  allowCommenting: boolean;
  commentCount: number;
}

interface FirestoreUser {
  username: string;
  displayName: string;
  photoURL: string;
  is_verified: boolean;
}

const getPostsFromDb = cache(async (ids: string[]) => {
  const postRefs = ids.map(id => db.collection("posts").doc(id));
  const postDocs = await db.getAll(...postRefs);
  return postDocs;
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
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
    const postDocs = await getPostsFromDb([id]);
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
    let is_saved = false;
    let is_liked = false;
    
    if (userId) {
      const [savedPostDoc, likeDoc] = await Promise.all([
        db.collection('users')
          .doc(userId)
          .collection('saved_posts')
          .where('postId', '==', id)
          .limit(1)
          .get(),
        db.collection('posts')
          .doc(id)
          .collection('likes')
          .doc(userId)
          .get()
      ]);
      
      is_saved = !savedPostDoc.empty;
      is_liked = likeDoc.exists;
    }

    // Format response data
    const responseData = {
      uid: postData.uid,
      id,
      photoURL: userData?.photoURL,
      displayName: userData?.displayName,
      content: postData.content,
      author: userData?.username,
      createdAt: postData.createdAt,
      imageUrls: postData.imageUrls || [],
      allowCommenting: postData.allowCommenting,
      likeCount: postData.likeCount || 0,
      commentCount: postData.commentCount || 0,
      is_saved,
      is_liked,
      is_verified: userData?.is_verified
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