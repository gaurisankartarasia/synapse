// // src/app/api/username/verify/route.ts
// import { NextResponse } from 'next/server';
// import { db } from '@/lib/firebaseAdmin';

// export async function POST(request: Request) {
//   try {
//     const { username } = await request.json();

//     // Check if username exists in Firestore
//     const snapshot = await db
//       .collection('users')
//       .where('username', '==', username)
//       .get();

//     if (!snapshot.empty) {
//       return NextResponse.json(
//         { error: 'Username already taken' },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ available: true });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies utility from Next.js
import { db } from '@/lib/firebaseAdmin';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    // Resolve cookies
    const cookieStore = await cookies(); // Await the cookies function
    const token = cookieStore.get('token'); // Use the get method to retrieve the token cookie
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user data
    const payload = await verifyJWT(token.value);
    
    if (!payload.uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { username } = await request.json();

    // Check if username exists in Firestore
    const snapshot = await db
      .collection('users')
      .where('username', '==', username)
      .get();

    if (!snapshot.empty) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    return NextResponse.json({ available: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
