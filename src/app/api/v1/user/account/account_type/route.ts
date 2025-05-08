
// src/app/api/v1/user/account-type/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyJWT(token)) as CustomJWTPayload;
    if (!payload.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const { accountType } = await request.json();

    if (!['personal', 'business', 'digital_creator'].includes(accountType)) {
      return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
    }

    await db.collection('users').doc(payload.uid).update({ account_type: accountType });

    return NextResponse.json({ message: 'Account type updated successfully' });
  } catch (error) {
    console.error('Account type update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}