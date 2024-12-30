// app/api/photo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { photoURL } = userDoc.data() as { photoURL: string };

    if (!photoURL) {
      return NextResponse.json({ error: 'photoURL not found' }, { status: 404 });
    }

    return NextResponse.json({ photoURL }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
