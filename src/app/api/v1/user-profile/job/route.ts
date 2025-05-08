// // src/app/api/v1/user/job-profile/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue

// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin'; // Your initialized Firebase Admin SDK
// import { CustomJWTPayload } from '@/types/auth'; // Your JWT payload type
// import { JobProfile } from '@/types/Job/JobProfile'; // Import the JobProfile type

// // --- GET Handler: Fetch User's Job Profile ---
// export async function GET(request: NextRequest) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

//     if (!payload?.uid) {
//       return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
//     }

//     const profileRef = db.collection('jobProfiles').doc(payload.uid);
//     const profileDoc = await profileRef.get();

//     if (!profileDoc.exists) {
//       // It's okay if the profile doesn't exist yet, return an empty object
//       // or a specific structure indicating no profile.
//       // Let's return an empty object for simplicity on the frontend.
//       return NextResponse.json({ profile: {} as JobProfile });
//     }

//     const profileData = profileDoc.data() as JobProfile;

//     // Optional: Convert Firestore Timestamps to ISO strings if needed by frontend
//     // (MUI date pickers might prefer strings or Date objects)
//     // This depends on how you store dates (Timestamps are recommended)
//     // Example:
//     // const processTimestamps = (data: any): any => {
//     //   for (const key in data) {
//     //     if (data[key] instanceof Timestamp) {
//     //       data[key] = data[key].toDate().toISOString();
//     //     } else if (typeof data[key] === 'object' && data[key] !== null) {
//     //       processTimestamps(data[key]); // Recurse for nested objects/arrays
//     //     }
//     //   }
//     //   return data;
//     // };
//     // const processedProfileData = processTimestamps({...profileData});

//     return NextResponse.json({ profile: profileData });

//   } catch (error: any) {
//     console.error('Job Profile fetch error:', error);
//     // Differentiate between auth errors and server errors
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// // --- POST Handler: Create or Update User's Job Profile ---
// export async function POST(request: NextRequest) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('token');

//     if (!token?.value) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

//     if (!payload?.uid) {
//       return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
//     }

//     const profileData = (await request.json()) as JobProfile;

//     // **IMPORTANT: Add Server-Side Validation Here**
//     // Use a library like Zod or Joi to validate the structure and types
//     // of profileData against your JobProfile schema. This prevents invalid
//     // data from being saved.
//     // Example (pseudo-code):
//     // const validationResult = JobProfileSchema.safeParse(profileData);
//     // if (!validationResult.success) {
//     //   return NextResponse.json({ error: 'Invalid profile data', details: validationResult.error.errors }, { status: 400 });
//     // }
//     // const validatedData = validationResult.data;

//     // For now, we'll proceed without validation, but ADD IT IN PRODUCTION!
//     const validatedData = profileData; // Replace with actual validated data

//     const profileRef = db.collection('jobProfiles').doc(payload.uid);

//     // Add/update server-side timestamps
//     const dataToSave = {
//         ...validatedData,
//         uid: payload.uid, // Ensure the UID is set correctly
//         updatedAt: FieldValue.serverTimestamp(), // Set updated time
//         // Conditionally set createdAt only if the document doesn't exist
//         // Using set with merge handles this implicitly if createdAt isn't in validatedData
//     };

//     // Use set with merge: true to create or overwrite/update the document
//     await profileRef.set(dataToSave, { merge: true });

//     // Optionally, set createdAt only on the first write.
//     // This requires a slightly more complex check or transaction if strictness is needed.
//     // A simpler approach is to just always include it in the merge if not present:
//     // const docSnapshot = await profileRef.get();
//     // if (!docSnapshot.exists) {
//     //    dataToSave.createdAt = FieldValue.serverTimestamp();
//     // }
//     // await profileRef.set(dataToSave, { merge: true });


//     // Fetch the newly saved data to return it (including server timestamps)
//     const updatedDoc = await profileRef.get();
//     const updatedProfile = updatedDoc.data() as JobProfile;

//      // Optional: Process timestamps before returning if needed
//      // const processedUpdatedProfile = processTimestamps({...updatedProfile});

//     return NextResponse.json({ profile: updatedProfile }, { status: 200 }); // 200 OK for update/create success

//   } catch (error: any) {
//     console.error('Job Profile save error:', error);
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//      if (error instanceof SyntaxError) { // JSON parsing error
//         return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
//     }
//     // Add more specific error handling (e.g., validation errors)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }









// src/app/api/v1/user/job-profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore'; // Import FieldValue

import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin'; // Your initialized Firebase Admin SDK
import { CustomJWTPayload } from '@/types/auth';
// Import the payload type which now includes email/resumeUrl
import { JobProfile, JobProfileApiPayload } from '@/types/Job/JobProfile';
import { z } from 'zod'; // Import Zod for validation

// --- Zod Schema for Validation (Highly Recommended) ---
const JobExperienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Start date must be YYYY-MM"), // Simple format check
  endDate: z.string().regex(/^\d{4}-\d{2}$/, "End date must be YYYY-MM").nullable().optional(),
  description: z.string().optional(),
});

const JobEducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Start date must be YYYY-MM"),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, "End date must be YYYY-MM").nullable().optional(),
  description: z.string().optional(),
});

const JobProfilePayloadSchema = z.object({
  headline: z.string().optional(),
  // ++ Validate email ++
  email: z.string().email("Invalid email address").optional().or(z.literal('')), // Allow empty string or valid email
  summary: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  // ++ Validate resumeUrl ++
  resumeUrl: z.string().url("Invalid URL format").optional().or(z.literal('')), // Allow empty or valid URL
  experience: z.array(JobExperienceSchema).optional().default([]),
  education: z.array(JobEducationSchema).optional().default([]),
  portfolioUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  linkedinUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  githubUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
});


// --- GET Handler (No changes needed for this request) ---
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
      // Return an empty profile object matching the JobProfile structure
       const emptyProfile: Partial<JobProfile> = {
          headline: '',
          email: '', // Default email
          summary: '',
          skills: [],
          resumeUrl: '', // Default resumeUrl
          experience: [],
          education: [],
          portfolioUrl: '',
          linkedinUrl: '',
          githubUrl: '',
          // Do not include uid, createdAt, updatedAt here for a non-existent profile
      };
      return NextResponse.json({ profile: emptyProfile as JobProfile });
    }

    const profileData = profileDoc.data() as JobProfile;

    // Convert Timestamps IF NEEDED (Example - uncomment/adapt if necessary)
    // const processTimestamps = (data: any): any => { ... };
    // const processedProfileData = processTimestamps({...profileData});

    // Ensure all fields expected by the frontend are present, even if undefined in DB
    const fullProfileData: JobProfile = {
        headline: '',
        email: '',
        summary: '',
        skills: [],
        resumeUrl: '',
        experience: [],
        education: [],
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: '',
        ...profileData, // Spread fetched data over defaults
    };


    return NextResponse.json({ profile: fullProfileData });

  } catch (error: any) {
    console.error('Job Profile fetch error:', error);
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

    // Use the specific API payload type
    const profileData = (await request.json()) as JobProfileApiPayload;

    // **Server-Side Validation using Zod**
    const validationResult = JobProfilePayloadSchema.safeParse(profileData);
    if (!validationResult.success) {
      console.error("Validation Errors:", validationResult.error.errors);
      return NextResponse.json(
          { error: 'Invalid profile data', details: validationResult.error.flatten().fieldErrors },
          { status: 400 }
      );
    }
    // Use the validated data from now on
    const validatedData = validationResult.data;


    const profileRef = db.collection('jobProfiles').doc(payload.uid);

    // Prepare data for saving, including server timestamps and UID
    const dataToSave = {
        ...validatedData, // Spread validated data (includes email, resumeUrl etc.)
        uid: payload.uid, // Ensure the UID is set correctly
        updatedAt: FieldValue.serverTimestamp(), // Set updated time
        // createdAt will be set below if document doesn't exist
    };

    // Check if the document exists to conditionally set createdAt
    const docSnapshot = await profileRef.get();
    if (!docSnapshot.exists) {
       // Type assertion might be needed depending on FieldValue and your data structure
       (dataToSave as any).createdAt = FieldValue.serverTimestamp();
    }

    // Use set with merge: true to create or update the document
    await profileRef.set(dataToSave, { merge: true });

    // Fetch the newly saved/updated data to return it (including server timestamps)
    const updatedDoc = await profileRef.get();
    const updatedProfile = updatedDoc.data() as JobProfile;

     // Optional: Process timestamps before returning if needed
     // const processedUpdatedProfile = processTimestamps({...updatedProfile});

    return NextResponse.json({ profile: updatedProfile }, { status: 200 }); // 200 OK

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