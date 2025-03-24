// src/app/api/admin/jobs/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db, FieldValue } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export async function POST(request: Request) {
    try {
        // 1. Verify Admin User
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token?.value) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const payload = await verifyJWT(token.value) as CustomJWTPayload;

        if (!payload.uid) {
            return NextResponse.json(
                { error: 'Invalid token payload' },
                { status: 401 }
            );
        }

        // **IMPORTANT**: You'll need to implement a proper admin check here.
        // For example, you might have a custom claim on the user's JWT
        // or a field in the user document in Firestore.
        // This is a placeholder!
        const isAdmin = true; // Replace with your actual admin check

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required' },
                { status: 403 }
            );
        }

        // 2. Process Form Data
        const jobData = await request.json();
        const { title, description, company, location, salary, jobType, requirements, deadline } = jobData;

        // 3. Create Firestore Document
        const newJobRef = db.collection('jobs').doc(); // Firestore auto-generates ID

        let deadlineTimestamp = null;
        if (deadline) {
            deadlineTimestamp = FieldValue.serverTimestamp(); // Convert JS Date to Firestore Timestamp
        }

        await newJobRef.set({
            title,
            description,
            company,
            location,
            salary,
            jobType,
            requirements,
            postedDate: FieldValue.serverTimestamp(),
            deadline: deadlineTimestamp,
            creatorId: payload.uid, // Add the creator's ID
        });

        return NextResponse.json({ message: 'Job posted successfully', jobId: newJobRef.id }, { status: 201 });
    } catch (error) {
        console.error('Error creating job:', error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}