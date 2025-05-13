
// // src/app/api/v1/auth/google/route.ts
// import { NextResponse } from 'next/server';
// import { auth, db, FieldValue } from '@/lib/firebaseAdmin';
// import { createJWT } from '@/lib/jwt';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
    
//     if (!body.idToken) {
//       return NextResponse.json(
//         { error: 'No ID token provided' },
//         { status: 400 }
//       );
//     }

//     const { idToken, userInfo } = body;

//     // Verify the ID token with more detailed error handling
//     let credential;
//     try {
//       credential = await auth.verifyIdToken(idToken);
//     } catch (error: any) {
//       console.error('Token verification failed:', error);
//       return NextResponse.json(
//         { error: 'Invalid ID token' },
//         { status: 401 }
//       );
//     }

//     // Get or create user data with error handling
//     const userRef = db.collection('users').doc(credential.uid);
    
//     try {
//       const userDoc = await userRef.get();
      
//       if (userDoc.exists) {
//         await userRef.update({
//           lastLogin: FieldValue.serverTimestamp(),
//           email: credential.email || userInfo.email,
//           displayName: credential.name || userInfo.displayName,
//           profilePhotoURL: credential.picture || userInfo.profilePhotoURL,
//         });
//       } else {
//         await userRef.set({
//           uid: credential.uid,
//           email: credential.email || userInfo.email,
//           displayName: credential.name || userInfo.displayName,
//           profilePhotoURL: credential.picture || userInfo.profilePhotoURL,
//           createdAt: FieldValue.serverTimestamp(),
//           lastLogin: FieldValue.serverTimestamp(),
//           serviceProvider: 'google',
//           emailVerified: credential.email_verified || false,
//         });
//       }
//     } catch (error: any) {
//       console.error('Firestore operation failed:', error);
//       return NextResponse.json(
//         { error: 'Database operation failed' },
//         { status: 500 }
//       );
//     }

//     // Get user record
//     let userRecord;
//     try {
//       userRecord = await auth.getUser(credential.uid);
//     } catch (error: any) {
//       console.error('Failed to get user record:', error);
//       return NextResponse.json(
//         { error: 'Failed to get user record' },
//         { status: 500 }
//       );
//     }

//     // Create JWT token
//     let token;
//     try {
//       token = await createJWT({
//         uid: userRecord.uid,
//         email: userRecord.email,
//       });
//     } catch (error: any) {
//       console.error('JWT creation failed:', error);
//       return NextResponse.json(
//         { error: 'Failed to create session' },
//         { status: 500 }
//       );
//     }

//     // Create response with cookie
//     const response = NextResponse.json({ 
//       user: {
//         uid: userRecord.uid,
//       }
//     });

//     // Set cookie
//     response.cookies.set({
//       name: 'token',
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'development',
//       sameSite: 'lax',
//       maxAge: 60 * 60 * 24, // 24 hours
//     });

//     return response;

//   } catch (error: any) {
//     console.error('Unexpected error in Google authentication:', error);
//     return NextResponse.json(
//       { error: 'Authentication failed' },
//       { status: 500 }
//     );
//   }
// }










// src/app/api/v1/auth/google/route.ts
import { NextResponse } from 'next/server';
import { auth, db, FieldValue } from '@/lib/firebaseAdmin';
import { createJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.idToken) {
      return NextResponse.json(
        { error: 'No ID token provided' },
        { status: 400 }
      );
    }

    const { idToken, userInfo } = body;

    // Verify the ID token with more detailed error handling
    let credential;
    try {
      credential = await auth.verifyIdToken(idToken);
    } catch (error: any) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }

    // Get email and extract username (part before @)
    const email = credential.email || userInfo.email || '';
    const username = email.split('@')[0];

    // Get or create user data with error handling
    const userRef = db.collection('users').doc(credential.uid);
    
    try {
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        await userRef.update({
          lastLogin: FieldValue.serverTimestamp(),
          email: email,
          username: username, // Using part before @ as username
          displayName: credential.name || userInfo.displayName,
          profilePhotoURL: credential.picture || userInfo.profilePhotoURL,
        });
      } else {
        await userRef.set({
          uid: credential.uid,
          email: email,
          username: username, // Using part before @ as username
          displayName: credential.name || userInfo.displayName,
          profilePhotoURL: credential.picture || userInfo.profilePhotoURL,
          createdAt: FieldValue.serverTimestamp(),
          lastLogin: FieldValue.serverTimestamp(),
          serviceProvider: 'google',
          emailVerified: credential.email_verified || false,
          isPrivate: false,
          isVerified: false,
          bio: 'Hey I am using Synapse!',
        });
      }
    } catch (error: any) {
      console.error('Firestore operation failed:', error);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }

    // Get user record
    let userRecord;
    try {
      userRecord = await auth.getUser(credential.uid);
    } catch (error: any) {
      console.error('Failed to get user record:', error);
      return NextResponse.json(
        { error: 'Failed to get user record' },
        { status: 500 }
      );
    }

    // Create JWT token
    let token;
    try {
      token = await createJWT({
        uid: userRecord.uid,
        email: userRecord.email,
        username: email.split('@')[0], // Including username in JWT (part before @)
        displayName: userRecord.displayName,
      });
    } catch (error: any) {
      console.error('JWT creation failed:', error);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json({ 
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        username: email.split('@')[0], // Including username in response (part before @)
        displayName: userRecord.displayName,
        profilePhotoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        isPrivate: false,
        isVerified: false,
      }
    });

    // Set cookie
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
    console.error('Unexpected error in Google authentication:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}




