
//src/app/api/v1/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { auth, db, FieldValue } from '@/lib/firebaseAdmin';
import { createJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username, // Store username in Firebase Auth's displayName field
      emailVerified: false,
    });

    // Create user document in Firestore with additional fields
    await db.collection('users').doc(userRecord.uid).set(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        username: username, // Save username instead of displayName
        displayName: username, // Ensure displayName defaults to username
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(), // Added updatedAt field
        lastLogin: FieldValue.serverTimestamp(),
        serviceProvider: 'email',
        emailVerified: false,
        isPrivate: false, 
        isVerified: false,
        bio: 'Hey I am using Synapse!', 
      },
      { merge: true } // Merge ensures existing data isn't overwritten
    );

    // Create JWT token
    const token = await createJWT({
      uid: userRecord.uid,
      email: userRecord.email,
    });

    // Set cookie with token
    const response = NextResponse.json({ user: userRecord });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}


