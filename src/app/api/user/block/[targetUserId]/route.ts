// // src/app/api/user/block/[targetUserId]/route.ts
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin';
// import { CustomJWTPayload } from '@/types/auth';

// export async function POST(request: Request, { params }: { params: { targetUserId: string } }) {
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

//     const { targetUserId } = params;

//     // Add the blocked user to the current user's blocked list
//     await db.collection('users').doc(payload.uid).collection('blocked').doc(targetUserId).set({
//       blockedAt: new Date().toISOString(),
//     });

//     return NextResponse.json({ message: 'User blocked successfully' });
//   } catch (error) {
//     console.error('Error blocking user:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: Request, context: { params: Promise<{ targetUserId: string }> }) {
  try {
    // Retrieve and await the params
    const { targetUserId } = await context.params;

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

    // Add the blocked user to the current user's blocked list
    await db.collection('users').doc(payload.uid).collection('blocked').doc(targetUserId).set({
      blockedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
