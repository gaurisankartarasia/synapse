
// src/app/api/v1/admin/jobs/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
import { verifyJWT } from '@/lib/jwt';
import { db, FieldValue, adminStorage } from '@/lib/firebaseAdmin'; // Import adminStorage
import { CustomJWTPayload } from '@/types/auth';

// Helper function to get file extension
const getFileExtension = (filename: string): string => {
   return filename.substring(filename.lastIndexOf('.'));
}

export async function POST(request: Request) {
    try {
        // 1. Verify Admin User (same as before)
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        if (!token?.value) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const payload = await verifyJWT(token.value) as CustomJWTPayload;
        if (!payload.uid) {
            return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
        }
       
        // 2. Process FormData
        const formData = await request.formData();

        const title = formData.get('title') as string | null;
        const description = formData.get('description') as string | null;
        const company = formData.get('company') as string | null;
        const location = formData.get('location') as string | null;
        const salary = formData.get('salary') as string | null;
        const jobType = formData.get('jobType') as string | null;
        const requirementsString = formData.get('requirements') as string | null; // Get as string
        const deadlineString = formData.get('deadline') as string | null; // Get as string
        const companyLogoFile = formData.get('companyLogoFile') as File | null; // Get the file

        // Basic validation for required text fields received from FormData
        if (!title || !description || !company || !location || !salary || !jobType || !requirementsString) {
             return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 3. Handle File Upload to Firebase Storage (if present)
        let companyLogoUrl: string | null = null;
        if (companyLogoFile) {
            try {
                // Generate a unique path/filename for the logo
                const fileExtension = getFileExtension(companyLogoFile.name);
                const uniqueFilename = `${uuidv4()}${fileExtension}`;
                const filePath = `company-logos/${uniqueFilename}`; // Store in a dedicated folder

                const bucket = adminStorage.bucket(); // Get default bucket
                const fileRef = bucket.file(filePath);

                // Convert File to Buffer
                const buffer = Buffer.from(await companyLogoFile.arrayBuffer());

                // Upload the file
                await fileRef.save(buffer, {
                    metadata: {
                        contentType: companyLogoFile.type, // Set content type
                        // Optional: Add custom metadata if needed
                        // metadata: { uploadedBy: payload.uid }
                    },
                    public: true, // Make the file publicly readable
                });

                // Get the public URL
                // Note: Ensure your bucket's permissions allow public reads
                // Alternatively, generate a signed URL if needed, but public is simpler for logos
                companyLogoUrl = fileRef.publicUrl();
                console.log(`Logo uploaded successfully: ${companyLogoUrl}`);

            } catch (uploadError) {
                console.error('Error uploading company logo:', uploadError);
                // Decide if you want to fail the whole request or just proceed without the logo
                return NextResponse.json({ message: 'Failed to upload company logo', error: (uploadError as Error).message }, { status: 500 });
            }
        }


        // 4. Prepare Data for Firestore
        const requirementsArray = requirementsString.split(',').map(item => item.trim()).filter(item => item);

        let deadlineTimestamp = null;
        if (deadlineString) {
            try {
                // Convert the date string to a Firestore Timestamp
                // Use Date.parse for flexibility, handles YYYY-MM-DD
                const deadlineDate = new Date(deadlineString);
                if (!isNaN(deadlineDate.getTime())) { // Check if date is valid
                   deadlineTimestamp = FieldValue.serverTimestamp(); // Use serverTimestamp for consistency
                   // Or directly use the date: deadlineTimestamp = Timestamp.fromDate(deadlineDate);
                } else {
                    console.warn(`Invalid deadline date string received: ${deadlineString}`);
                    // Optionally return an error or just proceed without deadline
                }
            } catch (dateError) {
                console.error('Error parsing deadline date:', dateError);
                // Handle error as needed
            }
        }

        const jobDataToSave = {
            title,
            description,
            company,
            location,
            salary,
            jobType,
            requirements: requirementsArray, // Save the parsed array
            postedDate: FieldValue.serverTimestamp(),
            deadline: deadlineTimestamp, // Save the timestamp or null
            creatorId: payload.uid,
            ...(companyLogoUrl && { companyLogoUrl }), // Conditionally add logo URL if it exists
        };


        // 5. Create Firestore Document
        const newJobRef = db.collection('jobs').doc();
        await newJobRef.set(jobDataToSave);

        return NextResponse.json({ message: 'Job posted successfully', jobId: newJobRef.id, companyLogoUrl }, { status: 201 });

    } catch (error) {
        console.error('Error creating job:', error);
        // Check if it's a known error type or provide a generic message
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to create job', error: errorMessage }, { status: 500 });
    }
}