// src/app/api/applications/list/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export async function GET() {
    try {
        // Verify User Authentication
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

        // Fetch applications submitted by the user
        const jobsSnapshot = await db.collectionGroup('applications')
            .where('applicantId', '==', payload.uid)
            .orderBy('applicationDate', 'desc')
            .get();

        const applications = jobsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(applications, { status: 200 });
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        return NextResponse.json({ error: 'Failed to fetch applied jobs' }, { status: 500 });
    }
}
