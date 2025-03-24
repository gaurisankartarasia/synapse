// src/app/api/jobs/search/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
        }

        const jobsRef = db.collection('jobs');
        const snapshot = await jobsRef.get(); // Fetch all jobs

        const searchedJobs: any[] = [];
        snapshot.forEach(doc => {
            const jobData = doc.data();
            if (
                jobData.title.toLowerCase().includes(query.toLowerCase()) ||
                jobData.description.toLowerCase().includes(query.toLowerCase()) ||
                jobData.company.toLowerCase().includes(query.toLowerCase())
            ) {
                searchedJobs.push({ id: doc.id, ...jobData });
            }
        });

        return NextResponse.json({ jobs: searchedJobs });

    } catch (error) {
        console.error('Error searching jobs:', error);
        return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 });
    }
}
