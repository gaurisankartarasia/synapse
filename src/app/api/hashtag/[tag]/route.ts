// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { tag: string } }
// ) {
//   try {
//     // Decode the tag in case it contains special characters
//     const tag = decodeURIComponent(params.tag).toLowerCase();
//     const { searchParams } = request.nextUrl;
//     const lastPostId = searchParams.get('lastPostId');

//     console.log(`Fetching posts for hashtag: ${tag}`);

//     // Query posts directly for the hashtag
//     let query = db.collection("posts")
//       .where("hashtags", "array-contains", tag)
//     //   .orderBy("createdAt", "desc");

//     if (lastPostId) {
//       const lastPostDoc = await db.collection("posts").doc(lastPostId).get();
//       if (lastPostDoc.exists) {
//         query = query.startAfter(lastPostDoc);
//       }
//     }
    

//     const postsSnapshot = await query.limit(5).get();
    
//     const posts = postsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     console.log(`Found ${posts.length} posts for hashtag: ${tag}`);

//     return NextResponse.json({
//       posts,
//       hasMore: posts.length === 5
//     });
//   } catch (error) {
//     console.error("Error fetching hashtag posts:", error);
//     return NextResponse.json({ 
//       error: "Failed to fetch posts.", 
//       details: (error instanceof Error) ? error.message : String(error) 
//     }, { status: 500 });
//   }
// }








// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest,
//   context: { params: Promise<{ tag: string }> }
// ) {
//   try {
//     // Await the params promise to get the actual params object
//     const { tag } = await context.params;
//     // Decode the tag in case it contains special characters
//     const decodedTag = decodeURIComponent(tag).toLowerCase();
//     const { searchParams } = request.nextUrl;
//     const lastPostId = searchParams.get('lastPostId');

//     console.log(`Fetching posts for hashtag: ${decodedTag}`);

//     // Query posts directly for the hashtag
//     let query = db.collection("posts")
//       .where("hashtags", "array-contains", decodedTag);

//     if (lastPostId) {
//       const lastPostDoc = await db.collection("posts").doc(lastPostId).get();
//       if (lastPostDoc.exists) {
//         query = query.startAfter(lastPostDoc);
//       }
//     }

//     const postsSnapshot = await query.limit(5).get();

//     const posts = postsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));

//     console.log(`Found ${posts.length} posts for hashtag: ${decodedTag}`);

//     return NextResponse.json({
//       posts,
//       hasMore: posts.length === 5
//     });
//   } catch (error) {
//     console.error("Error fetching hashtag posts:", error);
//     return NextResponse.json({ 
//       error: "Failed to fetch posts.", 
//       details: (error instanceof Error) ? error.message : String(error) 
//     }, { status: 500 });
//   }
// }






import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tag: string }> }
) {
  try {
    // Await the params promise to get the actual params object
    const { tag } = await context.params;
    // Decode the tag in case it contains special characters
    const decodedTag = decodeURIComponent(tag).toLowerCase();
    const { searchParams } = request.nextUrl;
    const lastPostId = searchParams.get("lastPostId");

    console.log(`Fetching posts for hashtag: ${decodedTag}`);

    // Query posts directly for the hashtag
    let query = db.collection("posts").where("hashtags", "array-contains", decodedTag);

    if (lastPostId) {
      const lastPostDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastPostDoc.exists) {
        query = query.startAfter(lastPostDoc);
      }
    }

    const postsSnapshot = await query.limit(5).get();

    const posts = postsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...(data as { uid: string }) // Ensure TypeScript knows `uid` exists
      };
    });
    

    console.log(`Found ${posts.length} posts for hashtag: ${decodedTag}`);

    // Fetch user profile data for each unique UID found in posts
    const userIds = [...new Set(posts.map((post) => post.uid))]; // Extract unique UIDs
    const userProfiles: Record<string, any> = {};

    if (userIds.length > 0) {
      const userDocs = await Promise.all(
        userIds.map((uid) => db.collection("users").doc(uid).collection("fields").get())
      );

      userIds.forEach((uid, index) => {
        const userDocSnapshot = userDocs[index];
        if (!userDocSnapshot.empty) {
          userProfiles[uid] = userDocSnapshot.docs.map((doc) => doc.data());
        }
      });
    }

    return NextResponse.json({
      posts,
      users: userProfiles, // Include user data mapped to UIDs
      hasMore: posts.length === 5,
    });
  } catch (error) {
    console.error("Error fetching hashtag posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch posts.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
