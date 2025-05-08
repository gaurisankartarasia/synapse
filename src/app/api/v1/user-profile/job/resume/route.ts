// src/app/api/v1/user/resume-upload/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid'; // For unique filenames

import { verifyJWT } from '@/lib/jwt';
import { db, adminStorage } from '@/lib/firebaseAdmin'; // Assuming adminApp is your initialized Admin SDK app
import { CustomJWTPayload } from '@/types/auth';

const MAX_FILE_SIZE_MB = 5; // Max 5 MB
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc (less common now)
];

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token?.value) {
            return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
        }

        const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

        if (!payload?.uid) {
            return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('resume') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
        }

        // --- File Validation ---
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
             return NextResponse.json({ error: `Invalid file type. Allowed: PDF, DOCX.` }, { status: 400 });
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return NextResponse.json({ error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.` }, { status: 400 });
        }
        // --- End Validation ---


        const bucket = adminStorage.bucket(); // Default bucket

        // Create a unique filename to avoid collisions and ensure security
        const fileExtension = file.name.split('.').pop();
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;
        const filePath = `resumes/${payload.uid}/${uniqueFilename}`; // Store in user-specific folder

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const storageFile = bucket.file(filePath);

        // Upload the file
        await storageFile.save(fileBuffer, {
            metadata: {
                contentType: file.type,
                // Add custom metadata if needed, e.g., original filename
                metadata: {
                    originalFilename: file.name,
                    userId: payload.uid,
                }
            },
            // Make the file publicly readable - adjust if you need signed URLs
            public: true,
        });

        // Get the public URL (ensure your bucket/file permissions allow public access)
        const publicUrl = storageFile.publicUrl();

        // Optionally: Store the storage path or filename in the user's profile
        // if you need to reference it later for deletion/replacement logic.

        return NextResponse.json({ resumeUrl: publicUrl }, { status: 200 });

    } catch (error: any) {
        console.error('Resume Upload error:', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Add more specific error handling (e.g., storage errors)
        return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
    }
}