// // src/app/api/post/[id]/report/route.ts
// import { db } from "@/lib/firebaseAdmin";
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyJWT } from "@/lib/jwt";
// import { CustomJWTPayload } from "@/types/auth";



// export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;
//     if (!id) {
//       return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//     }

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
//     if (!payload.uid) {
//       return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
//     }

//     const { reason } = await request.json();
//     if (!reason) {
//       return NextResponse.json({ error: "Report reason is required" }, { status: 400 });
//     }

//     const reportRef = db.collection("reports").doc();
//     await reportRef.set({
//       postId: id,
//       reportedBy: payload.uid,
//       reason,
//       reportedAt: new Date().toISOString(),
//       report_type: "post"
//     });

//     return NextResponse.json({ message: "Post reported successfully" });
//   } catch (error) {
//     console.error("Error reporting post:", error);
//     return NextResponse.json({ error: "Failed to report post." }, { status: 500 });
//   }
// }







//src/app/api/post/[postId]/report/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { CustomJWTPayload } from "@/types/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    // Await the params promise
    const { postId } = await context.params;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { reason } = await request.json();
    if (!reason) {
      return NextResponse.json({ error: "Report reason is required" }, { status: 400 });
    }

    const reportRef = db.collection("reports").doc();
    await reportRef.set({
      postId: postId,
      reportedBy: payload.uid,
      reason,
      reportedAt: new Date().toISOString(),
      report_type: "post"
    });

    return NextResponse.json({ message: "Post reported successfully" });
  } catch (error) {
    console.error("Error reporting post:", error);
    return NextResponse.json({ error: "Failed to report post." }, { status: 500 });
  }
}
