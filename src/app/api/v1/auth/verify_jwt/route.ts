//src/app/api/v1/auth/verify_jwt/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET as string;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token'); 

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token.value, secret);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}





