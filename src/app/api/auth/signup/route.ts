
// src/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { auth, db, FieldValue } from '@/lib/firebaseAdmin';
import { createJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      createdAt: FieldValue.serverTimestamp(), 
    });

    // Create JWT token
    const token = await createJWT({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    });

    // Set cookie with token
    const response = NextResponse.json({ user: userRecord }, { status: 201 });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
