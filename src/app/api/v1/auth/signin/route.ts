// // src/app/api/v1/auth/signin/route.ts
// import { NextResponse } from 'next/server';
// import { auth, FieldValue } from '@/lib/firebaseAdmin';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth as clientAuth } from '@/lib/firebaseClient';
// import { createJWT } from '@/lib/jwt';


// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     // Sign in using Firebase client SDK
//     const userCredential = await signInWithEmailAndPassword(
//       clientAuth,
//       email,
//       password
//     );

//     // Get additional user info from Firebase Admin
//     const userRecord = await auth.getUser(userCredential.user.uid);

//     // Create JWT token
//     const token = await createJWT({
//       uid: userRecord.uid,
//       email: userRecord.email,
//       displayName: userRecord.displayName,
//       lastLogin: FieldValue.serverTimestamp()
//     });

//     // Set cookie with token
//     const response = NextResponse.json({ user: userRecord });
//     response.cookies.set({
//       name: 'token',
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'development',
//       sameSite: 'lax',
//       maxAge: 60 * 60 * 24, // 24 hours
//     });

//     return response;
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 401 }
//     );
//   }
// }




//src/app/api/v1/auth/signin/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth, FieldValue } from '@/lib/firebaseAdmin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as clientAuth } from '@/lib/firebaseClient';
import { createJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Sign in using Firebase client SDK
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );

    // Get additional user info from Firebase Admin
    const userRecord = await auth.getUser(userCredential.user.uid);

    // Create JWT token
    const token = await createJWT({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      lastLogin: FieldValue.serverTimestamp()
    });

    // Set cookie with token using the cookies API
    const cookieStore = await cookies();
     cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ user: userRecord });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
