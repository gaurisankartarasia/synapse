// src/app/api/user/my-jobs/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt'; // Assuming this path is correct
import { db } from '@/lib/firebaseAdmin'; // Assuming this path is correct
import { CustomJWTPayload } from '@/types/auth'; // Assuming this path is correct
import { Timestamp } from 'firebase-admin/firestore'; // Import Timestamp

// Define an interface for the Job data structure (optional but recommended)
interface Job {
    id: string; // Add document ID
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[];
    postedDate: string; // Store as ISO string for serialization
    deadline: string | null; // Store as ISO string or null
    creatorId: string;
    companyLogoUrl?: string;
}

export async function GET() {
    try {
        // 1. Verify User Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token?.value) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }

        let payload: CustomJWTPayload;
        try {
            payload = await verifyJWT(token.value) as CustomJWTPayload;
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError);
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }


        if (!payload || !payload.uid) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token payload' }, { status: 401 });
        }

        const userId = payload.uid;

        // 2. Query Firestore for jobs created by the user
        const jobsRef = db.collection('jobs');
        const querySnapshot = await jobsRef.where('creatorId', '==', userId)
                                            .orderBy('postedDate', 'desc') // Optional: Order by most recent
                                            .get();

        if (querySnapshot.empty) {
            return NextResponse.json({ jobs: [] }, { status: 200 }); // Return empty array if no jobs found
        }

        // 3. Process and Format Job Data
        const jobs: Job[] = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();

            // Convert Firestore Timestamps to ISO strings for JSON serialization
            const postedDate = data.postedDate instanceof Timestamp
                ? data.postedDate.toDate().toISOString()
                : new Date().toISOString(); // Fallback, should ideally always be a Timestamp

            let deadline: string | null = null;
            if (data.deadline && data.deadline instanceof Timestamp) {
                deadline = data.deadline.toDate().toISOString();
            }

            jobs.push({
                id: doc.id, // Include the document ID
                title: data.title,
                description: data.description,
                company: data.company,
                location: data.location,
                salary: data.salary,
                jobType: data.jobType,
                requirements: data.requirements || [],
                postedDate: postedDate,
                deadline: deadline,
                creatorId: data.creatorId,
                companyLogoUrl: data.companyLogoUrl || null,
            });
        });

        // 4. Return the Jobs
        return NextResponse.json({ jobs }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user jobs:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to fetch jobs', error: errorMessage }, { status: 500 });
    }
}