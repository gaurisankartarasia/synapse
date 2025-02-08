
// src/app/api/auth/google/route.ts
import { NextResponse } from 'next/server';
import { auth, db, FieldValue } from '@/lib/firebaseAdmin';
import { createJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Verify the ID token from Google sign-in
    const credential = await auth.verifyIdToken(idToken);
    
    // Get or create user data
    const userRef = db.collection('users').doc(credential.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user
      await userRef.update({
        lastLogin: FieldValue.serverTimestamp(),
        email: credential.email,
        displayName: credential.name,
        photoURL: credential.picture,
      });
    } else {
      // Create new user document
      await userRef.set({
        uid:credential.uid,
        email: credential.email,
        displayName: credential.name,
        photoURL: credential.picture,
        created_at: FieldValue.serverTimestamp(),
        lastLogin: FieldValue.serverTimestamp(),
        provider: 'google',
        emailVerified: credential.email_verified,
        is_private:false,
        is_verified:false,
        bio:"Hey I am using Synapse!"
      });
    }

    // Get user record from Firebase Auth
    const userRecord = await auth.getUser(credential.uid);

    // Create JWT token
    const token = await createJWT({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    });

    // Set cookie with token
    const response = NextResponse.json({ user: userRecord });
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
    console.error('Error in Google authentication:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}