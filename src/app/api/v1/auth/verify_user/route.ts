// app/api/v1/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    return NextResponse.json(payload);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}