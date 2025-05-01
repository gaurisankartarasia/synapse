
// // // src/app/api/v1/jobs/[jobId]/route.ts

// import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest
// import { db } from '@/lib/firebaseAdmin'; // Ensure db is correctly initialized elsewhere
// import { JobDocumentData, JobApiResponse } from "@/types/Job/job";
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { CustomJWTPayload } from '@/types/auth';
// import { Timestamp } from 'firebase-admin/firestore'; // Import Timestamp if needed for type checking

// export async function GET(
//     { params }: { params: { jobId: string } } // Correct signature to get params
// ) {
//     // **Critical Fix:** Check if params or params.jobId is missing *before* destructuring
//     if (!params || !params.jobId) {
//         console.error("API Route Error: Missing jobId in params object:", params);
//         return NextResponse.json({ message: 'Job ID parameter is missing in the request URL' }, { status: 400 });
//     }

//     // Now it's safe to destructure
//     const { jobId } = params;
//     console.log(`API Route: Processing GET request for jobId: ${jobId}`); // Log the jobId being processed

//     let userId: string | null = null;
//     let isSaved = false;

//     try {
//         // --- Check Authentication (using request headers/cookies) ---
//         const cookie = await  cookies()
//         const tokenCookie = cookie.get('token'); // Get token from cookies

//         if (tokenCookie?.value) {
//             try {
//                 const payload = await verifyJWT(tokenCookie.value) as CustomJWTPayload;
//                 if (payload?.uid) {
//                     userId = payload.uid;
//                     console.log(`API Route: User authenticated with ID: ${userId}`);
//                 } else {
//                      console.log("API Route: JWT valid but no UID found in payload.");
//                 }
//             } catch (jwtError: any) {
//                 // Log JWT errors but don't fail the request, just proceed without user context
//                 console.warn(`API Route: JWT verification failed for job ${jobId}: ${jwtError.message || jwtError}`);
//                 userId = null;
//             }
//         } else {
//              console.log(`API Route: No authentication token found for job ${jobId} request.`);
//         }
//         // --- End Authentication Check ---

//         // --- Fetch Job Data ---
//         const jobRef = db.collection('jobs').doc(jobId);
//         const jobDocSnap = await jobRef.get();

//         if (!jobDocSnap.exists) {
//             console.log(`API Route: Job not found in Firestore for ID: ${jobId}`);
//             return NextResponse.json({ message: 'Job not found' }, { status: 404 });
//         }

//         // Assert data type after checking existence
//         const jobData = jobDocSnap.data() as JobDocumentData;
//         console.log(`API Route: Successfully fetched job data for ID: ${jobId}`);
//         // --- End Fetch Job Data ---


//         // --- Check if Saved (only if user is identified) ---
//         if (userId) {
//             try {
//                 const savedJobRef = db.collection('users').doc(userId).collection('savedJobs').doc(jobId);
//                 const savedDocSnap = await savedJobRef.get();
//                 isSaved = savedDocSnap.exists;
//                 console.log(`API Route: Save status for user ${userId}, job ${jobId}: ${isSaved}`);
//             } catch (saveCheckError) {
//                 console.error(`API Route: Error checking save status for job ${jobId} user ${userId}:`, saveCheckError);
//                 // Don't fail the whole request, just assume not saved if check fails
//                 isSaved = false;
//             }
//         }
//         // --- End Check if Saved ---

//         // --- Prepare Response Data ---
//         // Safely convert Firestore Timestamps to ISO strings
//         const postedDateISO = jobData.postedDate instanceof Timestamp
//             ? jobData.postedDate.toDate().toISOString()
//             : (typeof jobData.postedDate === 'string' ? jobData.postedDate : new Date().toISOString()); // Fallback if type is wrong

//         const deadlineISO = jobData.deadline instanceof Timestamp
//             ? jobData.deadline.toDate().toISOString()
//             : (typeof jobData.deadline === 'string' ? jobData.deadline : null); // Handle null or string dates


//         const responseData: JobApiResponse = {
//             id: jobDocSnap.id,
//             title: jobData.title ?? 'N/A', // Provide defaults for potentially missing fields
//             company: jobData.company ?? 'N/A',
//             location: jobData.location ?? 'N/A',
//             description: jobData.description ?? '',
//             requirements: jobData.requirements ?? [],
//             salary: jobData.salary ?? 'Not Specified',
//             jobType: jobData.jobType ?? 'N/A',
//             companyLogoUrl: jobData.companyLogoUrl ?? null,
//             creatorId: jobData.creatorId ?? null,
//             postedDate: postedDateISO,
//             deadline: deadlineISO,
//             isSavedByUser: isSaved, 
//             viewer:{
//                 uid: userId,
//             }
//         };
//         // --- End Prepare Response Data ---

//         console.log(`API Route: Sending successful response for job ID: ${jobId}`);
//         return NextResponse.json(responseData, { status: 200 });

//     } catch (error) {
//         console.error(`API Route: Unexpected error fetching job details for ID ${jobId}:`, error);
//         const errorMessage = error instanceof Error ? error.message : 'An unexpected internal server error occurred';
//         // Avoid leaking sensitive details in production error messages if possible
//         return NextResponse.json({ message: 'Failed to fetch job details due to a server error.', error: errorMessage }, { status: 500 });
//     }
// }





import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { JobDocumentData, JobApiResponse } from "@/types/Job/job";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ jobId: string }> } // Updated to handle Promise
) {
    // Await the params Promise
    const params = await context.params;
    
    // Check if params or jobId is missing
    if (!params || !params.jobId) {
        console.error("API Route Error: Missing jobId in params object:", params);
        return NextResponse.json({ message: 'Job ID parameter is missing in the request URL' }, { status: 400 });
    }

    const { jobId } = params;
    console.log(`API Route: Processing GET request for jobId: ${jobId}`);

    let userId: string | null = null;
    let isSaved = false;

    try {
        // --- Check Authentication ---
        const cookie = await cookies();
        const tokenCookie = cookie.get('token');

        if (tokenCookie?.value) {
            try {
                const payload = await verifyJWT(tokenCookie.value) as CustomJWTPayload;
                if (payload?.uid) {
                    userId = payload.uid;
                    console.log(`API Route: User authenticated with ID: ${userId}`);
                } else {
                    console.log("API Route: JWT valid but no UID found in payload.");
                }
            } catch (jwtError: any) {
                console.warn(`API Route: JWT verification failed for job ${jobId}: ${jwtError.message || jwtError}`);
                userId = null;
            }
        } else {
            console.log(`API Route: No authentication token found for job ${jobId} request.`);
        }

        // --- Fetch Job Data ---
        const jobRef = db.collection('jobs').doc(jobId);
        const jobDocSnap = await jobRef.get();

        if (!jobDocSnap.exists) {
            console.log(`API Route: Job not found in Firestore for ID: ${jobId}`);
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        const jobData = jobDocSnap.data() as JobDocumentData;
        console.log(`API Route: Successfully fetched job data for ID: ${jobId}`);

        // --- Check if Saved ---
        if (userId) {
            try {
                const savedJobRef = db.collection('users').doc(userId).collection('savedJobs').doc(jobId);
                const savedDocSnap = await savedJobRef.get();
                isSaved = savedDocSnap.exists;
                console.log(`API Route: Save status for user ${userId}, job ${jobId}: ${isSaved}`);
            } catch (saveCheckError) {
                console.error(`API Route: Error checking save status for job ${jobId} user ${userId}:`, saveCheckError);
                isSaved = false;
            }
        }

        // --- Prepare Response Data ---
        const postedDateISO = jobData.postedDate instanceof Timestamp
            ? jobData.postedDate.toDate().toISOString()
            : (typeof jobData.postedDate === 'string' ? jobData.postedDate : new Date().toISOString());

        const deadlineISO = jobData.deadline instanceof Timestamp
            ? jobData.deadline.toDate().toISOString()
            : (typeof jobData.deadline === 'string' ? jobData.deadline : null);

        const responseData: JobApiResponse = {
            id: jobDocSnap.id,
            title: jobData.title ?? 'N/A',
            company: jobData.company ?? 'N/A',
            location: jobData.location ?? 'N/A',
            description: jobData.description ?? '',
            requirements: jobData.requirements ?? [],
            salary: jobData.salary ?? 'Not Specified',
            jobType: jobData.jobType ?? 'N/A',
            companyLogoUrl: jobData.companyLogoUrl ?? null,
            creatorId: jobData.creatorId ?? null,
            postedDate: postedDateISO,
            deadline: deadlineISO,
            isSavedByUser: isSaved,
            viewer: {
                uid: userId,
            }
        };

        console.log(`API Route: Sending successful response for job ID: ${jobId}`);
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error(`API Route: Unexpected error fetching job details for ID ${jobId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected internal server error occurred';
        return NextResponse.json({ message: 'Failed to fetch job details due to a server error.', error: errorMessage }, { status: 500 });
    }
}