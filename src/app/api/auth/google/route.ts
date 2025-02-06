

// // src/app/api/auth/google/route.ts
// import { NextResponse } from 'next/server';
// import { auth, db } from '@/lib/firebaseAdmin';
// import { createJWT } from '@/lib/jwt';

// export async function POST(request: Request) {
//   try {
//     const { idToken } = await request.json();

//     // Verify the ID token from Google sign-in
//     const credential = await auth.verifyIdToken(idToken);
    
//     try {
//       // Get existing user record
//       const userRecord = await auth.getUser(credential.uid);
      
//       // Update or create user data in Firestore
//       const userData = {
//         email: credential.email,
//         name: credential.name || userRecord.displayName,
//         photoURL: credential.picture || userRecord.photoURL,
//         lastLogin: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         provider: 'google',
//       };

//       // Use set with merge option to update existing or create new document
//       await db.collection('users').doc(credential.uid).set(userData, { merge: true });

//       console.log('User data updated in Firestore:', credential.uid);

//       // Create JWT token
//       const token = await createJWT({
//         uid: userRecord.uid,
//         email: userRecord.email,
//         name: userRecord.displayName,
//       });

//       // Set cookie with token
//       const response = NextResponse.json({ user: userRecord });
//       response.cookies.set({
//         name: 'token',
//         value: token,
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24, // 24 hours
//       });

//       return response;

//     } catch (error) {
//       // If user doesn't exist in Firebase Auth, create new user
//       console.log('Creating new user:', credential.email);
      
//       const newUserRecord = await auth.createUser({
//         uid: credential.uid,
//         email: credential.email,
//         displayName: credential.name,
//         photoURL: credential.picture,
//       });

//       // Create new user document in Firestore
//       const newUserData = {
//         email: credential.email,
//         name: credential.name,
//         photoURL: credential.picture,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         lastLogin: new Date().toISOString(),
//         provider: 'google',
//         emailVerified: credential.email_verified,
//       };

//       // Explicitly create new document in Firestore
//       const userRef = db.collection('users').doc(credential.uid);
//       await userRef.create(newUserData);

//       console.log('New user created in Firestore:', credential.uid);

//       // Create JWT token for new user
//       const token = await createJWT({
//         uid: newUserRecord.uid,
//         email: newUserRecord.email,
//         name: newUserRecord.displayName,
//       });

//       // Set cookie with token
//       const response = NextResponse.json({ user: newUserRecord });
//       response.cookies.set({
//         name: 'token',
//         value: token,
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24,
//       });

//       return response;
//     }
//   } catch (error: any) {
//     console.error('Error in Google authentication:', error);
//     return NextResponse.json(
//       { error: error.message },
//       { status: 401 }
//     );
//   }
// }









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
        createdAt: FieldValue.serverTimestamp(),
        lastLogin: FieldValue.serverTimestamp(),
        provider: 'google',
        emailVerified: credential.email_verified,
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
      secure: process.env.NODE_ENV === 'development',
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