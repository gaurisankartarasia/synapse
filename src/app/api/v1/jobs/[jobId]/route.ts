
// src/app/api/v1/jobs/[jobId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { JobDocumentData, JobApiResponse } from "@/types/Job/job";
import { cookies } from 'next/headers'; // cookies() is needed here to read incoming request cookies
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
import { Timestamp } from 'firebase-admin/firestore';

// Corrected function signature for App Router API routes
export async function GET(
    request: NextRequest, // First argument is the request object
    context: { params: Promise< { jobId: string }> } // Second argument contains params
) {
    // Directly access jobId from context.params
    const { jobId } = await context.params;

    // Check if jobId is missing (should be caught by routing, but good practice)
    if (!jobId) {
        console.error("API Route Error: Missing jobId in context.params:", context.params);
        return NextResponse.json({ message: 'Job ID parameter is missing in the request URL path' }, { status: 400 });
    }

    console.log(`API Route: Processing GET request for jobId: ${jobId}`);

    let userId: string | null = null;
    let isSaved = false;
    let isApplied = false;

    try {
        // --- Check Authentication ---
        // Use cookies() from next/headers to read cookies from the incoming request
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get('token');

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
                // Don't throw error, just proceed as unauthenticated
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

        // --- Check Saved/Applied Status (Only if user is authenticated) ---
        if (userId) {
            // Check if Saved
            try {
                const savedJobRef = db.collection('users').doc(userId).collection('savedJobs').doc(jobId);
                const savedDocSnap = await savedJobRef.get();
                isSaved = savedDocSnap.exists;
                console.log(`API Route: Save status for user ${userId}, job ${jobId}: ${isSaved}`);
            } catch (saveCheckError) {
                console.error(`API Route: Error checking save status for job ${jobId} user ${userId}:`, saveCheckError);
                // Don't fail the request, default to false
                isSaved = false;
            }

            // Check if Applied (Using applicantId field as per original logic)
             try {
                const applicationsRef = jobRef.collection('applications');
                const applicationsQuery = applicationsRef.where('applicantId', '==', userId).limit(1); // Limit 1 for efficiency
                const applicationSnapshot = await applicationsQuery.get();
                isApplied = !applicationSnapshot.empty;
                console.log(`API Route: Application status (via applicantId) for user ${userId}, job ${jobId}: ${isApplied}`);

                 // Optional: Add check using structured ID if needed (uncomment if applicable)
                 /*
                 if (!isApplied) {
                     const expectedApplicationId = `${jobId}-${userId}`; // Assuming this structure
                     const specificApplicationDoc = await applicationsRef.doc(expectedApplicationId).get();
                     isApplied = specificApplicationDoc.exists;
                     console.log(`API Route: Application status (via doc ID ${expectedApplicationId}) for user ${userId}, job ${jobId}: ${isApplied}`);
                 }
                 */

            } catch (applicationCheckError) {
                console.error(`API Route: Error checking application status for job ${jobId} user ${userId}:`, applicationCheckError);
                 // Don't fail the request, default to false
                isApplied = false;
            }
        } else {
             console.log(`API Route: Skipping saved/applied check for unauthenticated user on job ${jobId}.`);
        }


        // --- Prepare Response Data ---
        // Safely handle Firestore Timestamps or string dates
        const postedDateISO = jobData.postedDate instanceof Timestamp
            ? jobData.postedDate.toDate().toISOString()
            : (typeof jobData.postedDate === 'string' ? new Date(jobData.postedDate).toISOString() : new Date().toISOString()); // Fallback careful

        const deadlineISO = jobData.deadline
            ? (jobData.deadline instanceof Timestamp
                ? jobData.deadline.toDate().toISOString()
                : (typeof jobData.deadline === 'string' ? new Date(jobData.deadline).toISOString() : null)) // Handle string date
            : null; // Explicitly null if no deadline


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
            isSavedByUser: isSaved, // Determined based on userId
            isApplied: isApplied,   // Determined based on userId
            viewer: { // Include viewer info (null if unauthenticated)
                uid: userId,
            }
        };

        console.log(`API Route: Sending successful response for job ID: ${jobId}`);
        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error(`API Route: Unexpected error fetching job details for ID ${jobId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected internal server error occurred';
        // Return a generic server error response
        return NextResponse.json({ message: 'Failed to fetch job details due to a server error.', error: errorMessage }, { status: 500 });
    }
}