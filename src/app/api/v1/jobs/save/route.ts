// src/app/api/jobs/save/route.ts
import { db } from "@/lib/firebaseAdmin"; // Adjust path if needed
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt'; // Adjust path if needed
import { CustomJWTPayload } from '@/types/auth'; // Adjust path if needed

export async function POST(request: NextRequest) {
    let uid: string | null = null;

    try {
        const cookieStore = await cookies(); // Use await if necessary in your setup, but often not needed here
        const token = cookieStore.get('token');

        if (!token?.value) {
            return NextResponse.json(
                { error: 'Unauthorized: No token provided' },
                { status: 401 }
            );
        }

        // Verify JWT and extract UID
        try {
            const payload = await verifyJWT(token.value) as CustomJWTPayload;
            if (!payload?.uid) {
                throw new Error('Invalid token payload');
            }
            uid = payload.uid;
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError);
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or expired token' },
                { status: 401 }
            );
        }

        // --- User is authenticated, proceed ---

        const { jobId } = await request.json();

        if (!jobId || typeof jobId !== 'string') {
            return NextResponse.json(
                { error: 'Job ID is required and must be a string' },
                { status: 400 }
            );
        }

        const userRef = db.collection('users').doc(uid); // Use the verified UID
        const savedJobsRef = userRef.collection('savedJobs'); // Target 'savedJobs' collection
        const jobDocRef = savedJobsRef.doc(jobId); // Use jobId as the document ID

        // Check if job is already saved
        const savedJobDoc = await jobDocRef.get();

        if (savedJobDoc.exists) {
            // Unsave the job
            await jobDocRef.delete();
            console.log(`Job ${jobId} unsaved for user ${uid}`);
            return NextResponse.json({ message: 'Job unsaved successfully', saved: false });
        } else {
            // Save the job - store minimal info like savedAt timestamp
            // You could store more job details here if needed, but often just the ID is sufficient
            // if you fetch details separately when displaying saved jobs.
            await jobDocRef.set({
                savedAt: new Date().toISOString(), // Use ISO string for consistency
                // Add any other minimal data you might want quick access to later
                // e.g., title: jobData.title, company: jobData.company (requires fetching job data or passing it)
            });
            console.log(`Job ${jobId} saved for user ${uid}`);
            return NextResponse.json({ message: 'Job saved successfully', saved: true });
        }
    } catch (error: any) {
        console.error("Error toggling save job status:", error);

        // Handle potential JSON parsing errors
        if (error instanceof SyntaxError) {
          return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // Avoid leaking internal details in production
        const errorMessage =  error.message || "Failed to toggle save status.";

        // Check if it was an auth error we didn't catch specifically
        if (error.message?.includes('Unauthorized') || error.message?.includes('Invalid token')) {
             return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 } // Internal Server Error
        );
    }
}

// Optional: Implement GET if you want to check saved status via API (though we'll do it server-side in the page)
// export async function GET(request: NextRequest) { ... }