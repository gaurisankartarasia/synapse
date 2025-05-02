
// src/app/api/v1/jobs/apply/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db, adminStorage, FieldValue } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: Request) {
    try {
        // 1. Verify User Authentication
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

        // 2. Process Form Data with Formidable
        const formData = await request.formData();
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const resume = formData.get('resume') as File;
        const coverLetter = formData.get('coverLetter') as string;
        const portfolio = formData.get('portfolio') as string;
        const jobId = formData.get('jobId') as string;

        if (!fullName || !email || !resume || !jobId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let resumeUrl = null;
        if (resume) {
            // Convert File to Buffer
            const bytes = await resume.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create a unique filename using UID and timestamp
            const timestamp = Date.now();
            const fileExtension = resume.name.split('.').pop() || 'pdf';
            const filename = `applications/${jobId}/${payload.uid}-${timestamp}.${fileExtension}`;

            // Upload to Firebase Storage
            const bucket = adminStorage.bucket();
            const file = bucket.file(filename);

            // Upload with content type and metadata
            await file.save(buffer, {
                metadata: {
                    contentType: resume.type,
                    metadata: {
                        originalName: resume.name,
                        uploadedBy: payload.uid,
                        timestamp: timestamp.toString()
                    }
                }
            });

            // Get the signed URL (more secure than making public)
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-24-2026' // Set appropriate expiration date
            });
            resumeUrl = url;
        }

        // 3. Store Application Data in Firestore
        const jobRef = db.collection('jobs').doc(jobId);
        const applicationsRef = jobRef.collection('applications');

        await applicationsRef.add({
            fullName,
            email,
            phone: phone || null,
            resumeUrl: resumeUrl,
            resumeFileName: resume ? `${payload.uid}-${Date.now()}.${resume.name.split('.').pop()}` : null,
            coverLetter: coverLetter || null,
            portfolio: portfolio || null,
            applicantId: payload.uid,
            applicationDate: FieldValue.serverTimestamp(),
        });

        // 4. Respond to the Client
        return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });

    } catch (error) {
        console.error('Error submitting application:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}