// src/app/api/user/username/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, FieldValue } from '@/lib/firebaseAdmin';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token.value);
    
    if (!payload.uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { username } = await request.json();

    // Check if username exists
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

    // Set the username in Firestore using admin SDK
    await db.collection('users').doc(payload.uid).set({
      username,
      updatedAt: FieldValue.serverTimestamp(),
      isPrivate:false,
        isVerified:false,
        bio:"Hey I am using Synapse!"
    }, { merge: true });

    return NextResponse.json({ username });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
