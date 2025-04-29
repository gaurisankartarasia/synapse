// src/app/api/v1/jobs/[jobId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Assuming 'admin' provides Timestamp type if needed
import { Timestamp } from 'firebase-admin/firestore'; // Explicit import for Timestamp type

// Define the structure of the Job data expected from Firestore
// Adjust based on your exact Firestore structure if needed
interface JobDocumentData {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[];
    postedDate: Timestamp; // Firestore Timestamp
    deadline?: Timestamp | null; // Optional Firestore Timestamp
    creatorId: string;
    companyLogoUrl?: string | null;
}

// Define the structure of the Job data to be sent in the API response
// Timestamps are converted to strings for JSON serialization
export interface JobApiResponse {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[];
    postedDate: string; // ISO string date
    deadline?: string | null; // Optional ISO string date
    creatorId: string; // Keep creatorId? Decide if needed on the frontend
    companyLogoUrl?: string | null;
}


export async function GET(
    request: Request, // Standard Request object (though not used here for params)
    { params }: { params: { jobId: string } }
) {
    try {
        const jobId = params.jobId;

        if (!jobId) {
            return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
        }

        const jobRef = db.collection('jobs').doc(jobId);
        const docSnap = await jobRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        const jobData = docSnap.data() as JobDocumentData;

        // Convert Firestore Timestamps to ISO strings for JSON compatibility
        const responseData: JobApiResponse = {
            id: docSnap.id,
            ...jobData,
            postedDate: jobData.postedDate.toDate().toISOString(),
            deadline: jobData.deadline ? jobData.deadline.toDate().toISOString() : null,
        };

        // Optional: Remove creatorId if you don't want to expose it
        // delete responseData.creatorId;

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error(`Error fetching job ${params.jobId}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to fetch job details', error: errorMessage }, { status: 500 });
    }
}