// src/app/api/user/job-profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue

import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin'; // Your initialized Firebase Admin SDK
import { CustomJWTPayload } from '@/types/auth'; // Your JWT payload type
import { JobProfile } from '@/types/Job/JobProfile'; // Import the JobProfile type

// --- GET Handler: Fetch User's Job Profile ---
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload?.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const profileRef = db.collection('jobProfiles').doc(payload.uid);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      // It's okay if the profile doesn't exist yet, return an empty object
      // or a specific structure indicating no profile.
      // Let's return an empty object for simplicity on the frontend.
      return NextResponse.json({ profile: {} as JobProfile });
    }

    const profileData = profileDoc.data() as JobProfile;

    // Optional: Convert Firestore Timestamps to ISO strings if needed by frontend
    // (MUI date pickers might prefer strings or Date objects)
    // This depends on how you store dates (Timestamps are recommended)
    // Example:
    // const processTimestamps = (data: any): any => {
    //   for (const key in data) {
    //     if (data[key] instanceof Timestamp) {
    //       data[key] = data[key].toDate().toISOString();
    //     } else if (typeof data[key] === 'object' && data[key] !== null) {
    //       processTimestamps(data[key]); // Recurse for nested objects/arrays
    //     }
    //   }
    //   return data;
    // };
    // const processedProfileData = processTimestamps({...profileData});

    return NextResponse.json({ profile: profileData });

  } catch (error: any) {
    console.error('Job Profile fetch error:', error);
    // Differentiate between auth errors and server errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- POST Handler: Create or Update User's Job Profile ---
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload?.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const profileData = (await request.json()) as JobProfile;

    // **IMPORTANT: Add Server-Side Validation Here**
    // Use a library like Zod or Joi to validate the structure and types
    // of profileData against your JobProfile schema. This prevents invalid
    // data from being saved.
    // Example (pseudo-code):
    // const validationResult = JobProfileSchema.safeParse(profileData);
    // if (!validationResult.success) {
    //   return NextResponse.json({ error: 'Invalid profile data', details: validationResult.error.errors }, { status: 400 });
    // }
    // const validatedData = validationResult.data;

    // For now, we'll proceed without validation, but ADD IT IN PRODUCTION!
    const validatedData = profileData; // Replace with actual validated data

    const profileRef = db.collection('jobProfiles').doc(payload.uid);

    // Add/update server-side timestamps
    const dataToSave = {
        ...validatedData,
        uid: payload.uid, // Ensure the UID is set correctly
        updatedAt: FieldValue.serverTimestamp(), // Set updated time
        // Conditionally set createdAt only if the document doesn't exist
        // Using set with merge handles this implicitly if createdAt isn't in validatedData
    };

    // Use set with merge: true to create or overwrite/update the document
    await profileRef.set(dataToSave, { merge: true });

    // Optionally, set createdAt only on the first write.
    // This requires a slightly more complex check or transaction if strictness is needed.
    // A simpler approach is to just always include it in the merge if not present:
    // const docSnapshot = await profileRef.get();
    // if (!docSnapshot.exists) {
    //    dataToSave.createdAt = FieldValue.serverTimestamp();
    // }
    // await profileRef.set(dataToSave, { merge: true });


    // Fetch the newly saved data to return it (including server timestamps)
    const updatedDoc = await profileRef.get();
    const updatedProfile = updatedDoc.data() as JobProfile;

     // Optional: Process timestamps before returning if needed
     // const processedUpdatedProfile = processTimestamps({...updatedProfile});

    return NextResponse.json({ profile: updatedProfile }, { status: 200 }); // 200 OK for update/create success

  } catch (error: any) {
    console.error('Job Profile save error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
     if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    // Add more specific error handling (e.g., validation errors)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}