// import { db } from "@/lib/firebaseAdmin"; // Firebase Admin SDK setup
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
//   const { username } = params;

//   if (!username) {
//     return NextResponse.json({ error: "Missing username" }, { status: 400 });
//   }

//   try {
//     // Step 1: Resolve UID from username
//     const usernameDoc = await db.collection("usernames").doc(username).get();

//     if (!usernameDoc.exists) {
//       return NextResponse.json({ error: "Username not found" }, { status: 404 });
//     }

//     const { uid } = usernameDoc.data() as { uid: string };

//     // Step 2: Fetch user profile using UID
//     const userDoc = await db.collection("users").doc(uid).get();

//     if (!userDoc.exists) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const userData = userDoc.data();

//     // Select only necessary fields
//     const profile = {
//       displayName: userData?.displayName || "",
//       followersCount: userData?.followersCount || 0,
//       followingCount: userData?.followingCount || 0,
//       photoURL: userData?.photoURL || "",
//       private: userData?.private || false,
//       username: userData?.username || "",
//       verified: userData?.verified || false,
//     };

//     return NextResponse.json({ profile }, {
//       headers: {
//         'Cache-Control': 'public, max-age=60, s-maxage=300',
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }







import { db } from "@/lib/firebaseAdmin"; // Firebase Admin SDK setup
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ username: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    // Resolve the params promise to get the username
    const resolvedParams = await params;
    const { username } = resolvedParams;

    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    // Step 1: Resolve UID from username
    const usernameDoc = await db.collection("usernames").doc(username).get();

    if (!usernameDoc.exists) {
      return NextResponse.json({ error: "Username not found" }, { status: 404 });
    }

    const { uid } = usernameDoc.data() as { uid: string };

    // Step 2: Fetch user profile using UID
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    // Select only necessary fields for the profile
    const profile = {
      displayName: userData?.displayName || "",
      followersCount: userData?.followersCount || 0,
      followingCount: userData?.followingCount || 0,
      photoURL: userData?.photoURL || "",
      private: userData?.private || false,
      username: userData?.username || "",
      verified: userData?.verified || false,
    };

    return NextResponse.json({ profile }, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
