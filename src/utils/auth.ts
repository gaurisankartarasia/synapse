//utils/auth.ts
import { auth } from '../lib/firebaseAdmin';
import { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';

export async function verifyAuth(request: NextRequest): Promise<DecodedIdToken> {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);

    (request as any).user = decodedToken; 

    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}



