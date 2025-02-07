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
    const lastPostId = searchParams.get('lastPostId');

    console.log(`Fetching posts for hashtag: ${decodedTag}`);

    // Query posts directly for the hashtag
    let query = db.collection("posts")
      .where("hashtags", "array-contains", decodedTag);

    if (lastPostId) {
      const lastPostDoc = await db.collection("posts").doc(lastPostId).get();
      if (lastPostDoc.exists) {
        query = query.startAfter(lastPostDoc);
      }
    }

    const postsSnapshot = await query.limit(5).get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${posts.length} posts for hashtag: ${decodedTag}`);

    return NextResponse.json({
      posts,
      hasMore: posts.length === 5
    });
  } catch (error) {
    console.error("Error fetching hashtag posts:", error);
    return NextResponse.json({ 
      error: "Failed to fetch posts.", 
      details: (error instanceof Error) ? error.message : String(error) 
    }, { status: 500 });
  }
}
