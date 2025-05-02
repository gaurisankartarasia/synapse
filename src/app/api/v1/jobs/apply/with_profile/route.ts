
// // src/app/api/v1/jobs/apply/with_profile/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
// import { FieldValue } from 'firebase-admin/firestore';

// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin'; // Added adminStorage for resume upload
// import { CustomJWTPayload } from '@/types/auth';
// import { JobProfile } from '@/types/Job/JobProfile';
// import { User } from '@/types/user';

// // --- GET Handler: Fetch User's Core Data and Job Profile ---
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

//     const uid = payload.uid;

//     // Fetch User Data from 'users' collection
//     const userRef = db.collection('users').doc(uid);
//     const userDoc = await userRef.get();

//     if (!userDoc.exists) {
//       console.error(`User document not found for authenticated user: ${uid}`);
//       return NextResponse.json({ error: 'User data not found' }, { status: 404 });
//     }
//     const userData = userDoc.data() as User;

//     // Fetch Job Profile from 'jobProfiles' collection
//     const profileRef = db.collection('jobProfiles').doc(uid);
//     const profileDoc = await profileRef.get();

//     let profileData: JobProfile | null = null;
//     if (profileDoc.exists) {
//       profileData = profileDoc.data() as JobProfile;
//     }

//     return NextResponse.json({
//       userData: {
//         uid: userData.uid,
//         email: userData.email,
//         displayName: userData.displayName,
//         photoURL: userData.profilePhotoURL || null,
//       },
//       profile: profileData
//     });

//   } catch (error: any) {
//     console.error('User/Profile fetch error:', error);
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// // --- POST Handler: Apply to job using profile data ---
// // Modified to store application in jobs/{jobId}/applications like in code1
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

//     // Get request data which should include jobId and any potential overrides
//     const requestData = await request.json();
//     const { jobId, resume, ...profileOverrides } = requestData;

//     if (!jobId) {
//       return NextResponse.json({ error: 'Missing job ID' }, { status: 400 });
//     }

//     // 1. Get user profile data from jobProfiles collection
//     const profileRef = db.collection('jobProfiles').doc(payload.uid);
//     const profileDoc = await profileRef.get();

//     if (!profileDoc.exists) {
//       return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
//     }

//     const profileData = profileDoc.data() as JobProfile;

//     // 2. Get user data for any missing fields
//     const userRef = db.collection('users').doc(payload.uid);
//     const userDoc = await userRef.get();
    
//     if (!userDoc.exists) {
//       return NextResponse.json({ error: 'User data not found' }, { status: 404 });
//     }
    
//     const userData = userDoc.data() as User;

//     // 3. Process resume if provided
//     let resumeUrl = null;
//     let resumeFileName = null;

//     if (resume && typeof resume === 'object') {
//       // Note: In reality, you'd need a proper file upload mechanism here
//       // This is a simplified version assuming resume is already a File object
//       // converted to data that can be processed directly
      
//       // For practical implementation, you would need formData handling as in code1
//       // This part would be similar to code1's File handling logic
      
//       // Placeholder for resume processing logic
//       // In a real implementation, you'd convert the base64 data or handle file upload
      
//       // Create a unique filename using UID and timestamp
//       const timestamp = Date.now();
//       const fileExtension = 'pdf'; // Default or extract from filename
//       const filename = `applications/${jobId}/${payload.uid}-${timestamp}.${fileExtension}`;
      
//       // Simplified placeholder for file upload logic
//       resumeFileName = `${payload.uid}-${timestamp}.${fileExtension}`;
//       resumeUrl = `https://storage.example.com/${filename}`; // Placeholder URL
      
//       // In actual code, you would implement file upload logic similar to code1:
//       /*
//       const bucket = adminStorage.bucket();
//       const file = bucket.file(filename);
//       await file.save(buffer, { ... });
//       const [url] = await file.getSignedUrl({ ... });
//       resumeUrl = url;
//       */
//     } else if (profileData.resumeUrl) {
//       // Use existing resume from profile if available
//       resumeUrl = profileData.resumeUrl;
//     }

//     // 4. Store Application Data in Firestore under jobs/{jobId}/applications
//     const jobRef = db.collection('jobs').doc(jobId);
//     const applicationsRef = jobRef.collection('applications');

//     // Combine profile data with any overrides
//     await applicationsRef.add({
//       fullName: profileOverrides.fullName || userData.displayName || '',
//       email: profileOverrides.email || profileData.email || userData.email || '',
//       phone: profileOverrides.phone || profileData.phone || null,
//       resumeUrl: resumeUrl,
//       coverLetter: profileOverrides.coverLetter || profileData.coverLetter || null,
//       portfolio: profileOverrides.portfolio || profileData.portfolio || null,
//       // Include other relevant profile fields
//       education: profileData.education || null,
//       experience: profileData.experience || null,
//       skills: profileData.skills || null,
//       // Standard application fields
//       applicationId: `${jobId}-${payload.uid}-${Date.now()}`, 
//       applicantId: payload.uid,
//       applicationDate: FieldValue.serverTimestamp(),
//     });

//     return NextResponse.json({ message: 'Application submitted successfully using profile data' }, { status: 201 });

//   } catch (error: any) {
//     console.error('Job application with profile error:', error);
//     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     if (error instanceof SyntaxError) {
//       return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
//     }
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }







// src/app/api/v1/jobs/apply/with_profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin'; // Added adminStorage for resume upload
import { CustomJWTPayload } from '@/types/auth';
import { JobProfile } from '@/types/Job/JobProfile';
import { User } from '@/types/user';

// --- GET Handler: Fetch User's Core Data and Job Profile ---
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

    const uid = payload.uid;

    // Fetch User Data from 'users' collection
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error(`User document not found for authenticated user: ${uid}`);
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }
    const userData = userDoc.data() as User;

    // Fetch Job Profile from 'jobProfiles' collection
    const profileRef = db.collection('jobProfiles').doc(uid);
    const profileDoc = await profileRef.get();

    let profileData: JobProfile | null = null;
    if (profileDoc.exists) {
      profileData = profileDoc.data() as JobProfile;
    }

    return NextResponse.json({
      userData: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.profilePhotoURL || null,
      },
      profile: profileData
    });

  } catch (error: any) {
    console.error('User/Profile fetch error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- POST Handler: Apply to job using profile data ---
// Modified to store application in jobs/{jobId}/applications like in code1
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

    // Get request data which should include jobId and any potential overrides
    const requestData = await request.json();
    const { jobId, resume, ...profileOverrides } = requestData;

    if (!jobId) {
      return NextResponse.json({ error: 'Missing job ID' }, { status: 400 });
    }

    // 1. Get user profile data from jobProfiles collection
    const profileRef = db.collection('jobProfiles').doc(payload.uid);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    const profileData = profileDoc.data() as JobProfile;

    // 2. Get user data for any missing fields
    const userRef = db.collection('users').doc(payload.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }
    
    const userData = userDoc.data() as User;

    // 3. Process resume if provided
    let resumeUrl = null;
    let resumeFileName = null;

    if (resume && typeof resume === 'object') {
      // Note: In reality, you'd need a proper file upload mechanism here
      // This is a simplified version assuming resume is already a File object
      // converted to data that can be processed directly
      
      // For practical implementation, you would need formData handling as in code1
      // This part would be similar to code1's File handling logic
      
      // Placeholder for resume processing logic
      // In a real implementation, you'd convert the base64 data or handle file upload
      
      // Create a unique filename using UID and timestamp
      const timestamp = Date.now();
      const fileExtension = 'pdf'; // Default or extract from filename
      const filename = `applications/${jobId}/${payload.uid}-${timestamp}.${fileExtension}`;
      
      // Simplified placeholder for file upload logic
      resumeFileName = `${payload.uid}-${timestamp}.${fileExtension}`;
      resumeUrl = `https://storage.example.com/${filename}`; // Placeholder URL
      
      // In actual code, you would implement file upload logic similar to code1:
      /*
      const bucket = adminStorage.bucket();
      const file = bucket.file(filename);
      await file.save(buffer, { ... });
      const [url] = await file.getSignedUrl({ ... });
      resumeUrl = url;
      */
    } else if (profileData.resumeUrl) {
      // Use existing resume from profile if available
      resumeUrl = profileData.resumeUrl;
    }

    // 4. Store Application Data in Firestore under jobs/{jobId}/applications
    const jobRef = db.collection('jobs').doc(jobId);
    const applicationsRef = jobRef.collection('applications');
    
    // Generate a custom document ID
    const applicationId = `${jobId}-${payload.uid}-${Date.now()}`;

    // Combine profile data with any overrides
    await applicationsRef.doc(applicationId).set({
      fullName: profileOverrides.fullName  || userData.displayName || '',
      email: profileOverrides.email || profileData.email || userData.email || '',
      phone: profileOverrides.phone || profileData.phone || null,
      resumeUrl: resumeUrl,
      coverLetter: profileOverrides.coverLetter || profileData.coverLetter || null,
      portfolio: profileOverrides.portfolio || null,
      // Include other relevant profile fields
      education: profileData.education || null,
      experience: profileData.experience || null,
      skills: profileData.skills || null,
      // Standard application fields
      applicationId: `${jobId}-${payload.uid}-${Date.now()}`,
      applicantId: payload.uid,
      applicationDate: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: 'Application submitted successfully using profile data' }, { status: 201 });

  } catch (error: any) {
    console.error('Job application with profile error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}