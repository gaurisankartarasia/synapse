// src/app/api/jobs/saved/route.ts
import { db } from "@/lib/firebaseAdmin"; // Adjust path if needed
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt'; // Adjust path if needed
import { CustomJWTPayload } from '@/types/auth'; // Adjust path if needed

// Define a type for the full job details (adjust based on your actual Job schema)
interface JobDetails {
    id: string;
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    // Add other relevant fields from your 'jobs' collection
    postedAt?: string | Date; // Example
    applyUrl?: string; // Example
}

// Combined type for display - This is what the API will return
export interface SavedJobDisplayData extends JobDetails {
    savedAt: string; // ISO String
}


export async function GET(request: NextRequest) {
    let uid: string | null = null;

    try {
        // 1. Authenticate the user
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token?.value) {
            return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
        }

        try {
            const payload = await verifyJWT(token.value) as CustomJWTPayload;
            if (!payload?.uid) {
                throw new Error('Invalid token payload');
            }
            uid = payload.uid;
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError);
            return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
        }

        // --- User is authenticated ---

        // 2. Fetch saved job IDs and timestamps
        const userRef = db.collection('users').doc(uid);
        const savedJobsRef = userRef.collection('savedJobs');
        const savedJobsSnapshot = await savedJobsRef.orderBy('savedAt', 'desc').get();

        if (savedJobsSnapshot.empty) {
            return NextResponse.json([], { status: 200 }); // Return empty array if no jobs saved
        }

        const savedJobInfos = savedJobsSnapshot.docs.map(doc => ({
            id: doc.id, // The Job ID
            savedAt: doc.data().savedAt || new Date(0).toISOString(), // Get savedAt
        }));

        const jobIds = savedJobInfos.map(info => info.id);

        if (jobIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // 3. Fetch full job details for the saved job IDs
        // Use Firestore's 'in' query for efficiency if jobIds > 10 (or always use getAll for simplicity)
        // Note: 'in' query limit is 30 values as of recent updates. getAll is often simpler.
        const jobRefs = jobIds.map(id => db.collection('jobs').doc(id));
        const jobDetailSnapshots = await db.getAll(...jobRefs); // Efficiently get multiple documents

        // 4. Combine data and prepare the response
        const savedJobsDataMap = new Map<string, SavedJobDisplayData>();
        jobDetailSnapshots.forEach((docSnapshot) => {
            if (docSnapshot.exists) {
                const jobData = docSnapshot.data() as Omit<JobDetails, 'id'>;
                // Find the corresponding savedAt timestamp
                const savedInfo = savedJobInfos.find(info => info.id === docSnapshot.id);
                if (savedInfo) {
                    savedJobsDataMap.set(docSnapshot.id, {
                        ...jobData,
                        id: docSnapshot.id,
                        savedAt: savedInfo.savedAt,
                    });
                }
            } else {
                 console.warn(`Job details not found for saved job ID: ${docSnapshot.id}`);
            }
        });

        // Ensure the order matches the savedAt order from the initial query
        const finalResponseData: SavedJobDisplayData[] = jobIds
            .map(id => savedJobsDataMap.get(id))
            .filter((job): job is SavedJobDisplayData => job !== undefined); // Filter out any undefined entries (jobs not found)


        return NextResponse.json(finalResponseData);

    } catch (error: any) {
        console.error("Error fetching saved jobs:", error);
        const errorMessage =  error.message || "Failed to fetch saved jobs.";
        if (error.message?.includes('Unauthorized') || error.message?.includes('Invalid token')) {
             return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}