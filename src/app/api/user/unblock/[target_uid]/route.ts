// // src/app/api/user/unblock/[target_uid]/route.ts
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin';
// import { CustomJWTPayload } from '@/types/auth';

// export async function POST(request: Request, { params }: { params: { target_uid: string } }) {
//   try {
//     // Retrieve token from cookies
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Verify token and extract payload
//     const payload = await verifyJWT(token.value) as CustomJWTPayload;

//     if (!payload.uid) {
//       return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
//     }

//     const { target_uid } = params;

//     // Remove the blocked user from the current user's blocked list
//     await db.collection('users').doc(payload.uid).collection('blocked').doc(target_uid).delete();

//     return NextResponse.json({ message: 'User unblocked successfully' });
//   } catch (error) {
//     console.error('Error unblocking user:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }



// src/app/api/user/unblock/[target_uid]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: Request, context: { params: Promise<{ target_uid: string }> }) {
  try {
    // Retrieve and await the params
    const { target_uid } = await context.params;

    // Retrieve token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and extract payload
    const payload = await verifyJWT(token.value) as CustomJWTPayload;

    if (!payload.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Remove the blocked user from the current user's blocked list
    await db.collection('users').doc(payload.uid).collection('blocked').doc(target_uid).delete();

    return NextResponse.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

