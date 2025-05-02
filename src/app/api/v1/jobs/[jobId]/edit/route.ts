// // src/app/api/v1/jobs/[jobId]/route.ts
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { db, adminStorage, Timestamp } from '@/lib/firebaseAdmin'; // Import Timestamp
// import { CustomJWTPayload } from '@/types/auth';
// import { v4 as uuidv4 } from 'uuid'; 

// interface JobDataFromFirestore {
//     title: string;
//     description: string;
//     company: string;
//     location: string;
//     salary: string;
//     jobType: string;
//     requirements: string[];
//     postedDate: Timestamp; // Firestore Timestamp
//     deadline?: Timestamp | null; // Firestore Timestamp
//     creatorId: string;
//     companyLogoUrl?: string;
// }

// // Helper function to safely convert Firestore Timestamps to ISO strings
// // Frontend Date inputs often work better with YYYY-MM-DD or ISO strings
// const serializeTimestamps = (data: Record<string, any>) => {
//     const serialized: Record<string, any> = {};
//     for (const key in data) {
//         if (data[key] instanceof Timestamp) {
//             // Format deadline specifically for <input type="date">
//             if (key === 'deadline') {
//                  // Convert Firestore Timestamp to JavaScript Date, then format
//                  const date = data[key].toDate();
//                  // Format as YYYY-MM-DD. Handle potential timezone issues if necessary.
//                  // getUTCFullYear, getUTCMonth, getUTCDate might be safer depending on requirements
//                  const year = date.getFullYear();
//                  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
//                  const day = date.getDate().toString().padStart(2, '0');
//                  serialized[key] = `${year}-${month}-${day}`;
//             } else {
//                 // For other timestamps like postedDate, use ISO string
//                 serialized[key] = data[key].toDate().toISOString();
//             }
//         } else {
//             serialized[key] = data[key];
//         }
//     }
//     return serialized;
// };


// export async function GET(
//     request: Request,
//     { params }: { params: { jobId: string } }
// ) {
//     try {
//         const jobId = params.jobId;
//         if (!jobId) {
//             return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
//         }

//         // 1. Verify User Token (Optional but good practice for API consistency)
//         const cookieStore = await cookies();
//         const token = cookieStore.get('token');
//         let userId: string | null = null;

//         if (token?.value) {
//             try {
//                 const payload = await verifyJWT(token.value) as CustomJWTPayload;
//                 userId = payload.uid || null;
//             } catch (jwtError) {
//                 console.warn("JWT verification failed:", jwtError);
//                 // Proceed without userId, edit check will fail later if token was invalid
//             }
//         }

//         // 2. Fetch Job Data from Firestore
//         const jobRef = db.collection('jobs').doc(jobId);
//         const jobDoc = await jobRef.get();

//         if (!jobDoc.exists) {
//             return NextResponse.json({ message: 'Job not found' }, { status: 404 });
//         }

//         const jobData = jobDoc.data() as JobDataFromFirestore;

//         // 3. Check Edit Permission
//         const isEditable = !!userId && jobData.creatorId === userId; // Check if logged-in user is the creator

//         // 4. Serialize data (convert Timestamps for frontend)
//         const serializedJobData = serializeTimestamps(jobData);

//         // 5. Return Data and Edit Flag
//         return NextResponse.json({
//             jobData: serializedJobData,
//             isEditable: isEditable
//         }, { status: 200 });

//     } catch (error) {
//         console.error('Error fetching job details:', error);
//         const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
//         return NextResponse.json({ message: 'Failed to fetch job details', error: errorMessage }, { status: 500 });
//     }
// }

// // --- PUT Method (for updating) will go in the same file ---
// // (See next section)


// // src/app/api/v1/jobs/[jobId]/route.ts


// // Helper function to get file extension (reuse from POST)
// const getFileExtension = (filename: string): string => {
//    return filename.substring(filename.lastIndexOf('.'));
// }

// // Helper function to safely delete file from storage
// const deleteStorageFile = async (fileUrl: string | undefined | null) => {
//     if (!fileUrl) return; // No URL, nothing to delete

//     try {
//         // Extract the path from the public URL
//         // This assumes the URL format: https://storage.googleapis.com/your-bucket-name/path/to/file
//         const urlParts = fileUrl.split('/');
//         const bucketName = urlParts[2].split('.')[0]; // Or get your bucket name reliably
//         const filePath = urlParts.slice(3).join('/');

//         if (!filePath) {
//             console.warn("Could not extract file path from URL:", fileUrl);
//             return;
//         }

//         console.log(`Attempting to delete file: ${filePath} from bucket: ${bucketName}`);

//         const bucket = adminStorage.bucket(); // Get default bucket (or specify if needed)
//         const fileRef = bucket.file(decodeURIComponent(filePath)); // Decode URI component just in case

//         await fileRef.delete();
//         console.log(`Successfully deleted old file: ${filePath}`);
//     } catch (error: any) {
//         // Log deletion errors but don't necessarily fail the update
//         // Common error: Object not found (code 404), which is okay if it was already deleted
//         if (error.code === 404) {
//             console.log(`File not found during delete (already deleted?): ${fileUrl}`);
//         } else {
//             console.error(`Error deleting file from storage (${fileUrl}):`, error);
//         }
//     }
// };


// export async function PUT(
//     request: Request,
//     { params }: { params: { jobId: string } }
// ) {
//     try {
//         const jobId = params.jobId;
//         if (!jobId) {
//             return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
//         }

//         // 1. Verify User Token and Get User ID (Required for permission check)
//         const cookieStore = await cookies();
//         const token = cookieStore.get('token');
//         if (!token?.value) {
//             return NextResponse.json({ message: 'Unauthorized: Login required' }, { status: 401 });
//         }

//         let payload: CustomJWTPayload;
//         try {
//             payload = await verifyJWT(token.value) as CustomJWTPayload;
//             if (!payload.uid) {
//                 throw new Error('Invalid token payload');
//             }
//         } catch (jwtError) {
//             console.error("JWT Verification failed:", jwtError);
//             return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
//         }
//         const userId = payload.uid;

//         // 2. Fetch Existing Job Data to Verify Ownership and get old logo URL
//         const jobRef = db.collection('jobs').doc(jobId);
//         const jobDoc = await jobRef.get();

//         if (!jobDoc.exists) {
//             return NextResponse.json({ message: 'Job not found' }, { status: 404 });
//         }

//         const existingJobData = jobDoc.data() as JobDataFromFirestore;

//         // 3. --- CRUCIAL: Verify Ownership ---
//         if (existingJobData.creatorId !== userId) {
//             return NextResponse.json({ message: 'Forbidden: You are not authorized to edit this job' }, { status: 403 });
//         }

//         // 4. Process FormData
//         const formData = await request.formData();
//         const title = formData.get('title') as string | null;
//         const description = formData.get('description') as string | null;
//         const company = formData.get('company') as string | null;
//         const location = formData.get('location') as string | null;
//         const salary = formData.get('salary') as string | null;
//         const jobType = formData.get('jobType') as string | null;
//         const requirementsString = formData.get('requirements') as string | null;
//         const deadlineString = formData.get('deadline') as string | null;
//         const companyLogoFile = formData.get('companyLogoFile') as File | null;
//         // Optional: Add a flag to explicitly remove the logo if needed
//         // const removeLogo = formData.get('removeLogo') === 'true';

//         // Basic validation (similar to POST)
//         if (!title || !description || !company || !location || !salary || !jobType || !requirementsString) {
//              return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//         }

//         // 5. Handle File Upload (if new logo provided)
//         let newCompanyLogoUrl: string | null | undefined = existingJobData.companyLogoUrl; // Default to existing
//         let oldLogoUrlToDelete: string | null = null;

//         if (companyLogoFile) {
//             // A new logo is being uploaded, replace the old one
//             console.log("New company logo file detected for update.");
//             oldLogoUrlToDelete = existingJobData.companyLogoUrl || null; // Mark old logo for deletion

//             try {
//                 const fileExtension = getFileExtension(companyLogoFile.name);
//                 const uniqueFilename = `${uuidv4()}${fileExtension}`;
//                 const filePath = `company-logos/${uniqueFilename}`;
//                 const bucket = adminStorage.bucket();
//                 const fileRef = bucket.file(filePath);
//                 const buffer = Buffer.from(await companyLogoFile.arrayBuffer());

//                 await fileRef.save(buffer, {
//                     metadata: { contentType: companyLogoFile.type },
//                     public: true,
//                 });
//                 newCompanyLogoUrl = fileRef.publicUrl();
//                 console.log(`New logo uploaded successfully: ${newCompanyLogoUrl}`);

//             } catch (uploadError) {
//                 console.error('Error uploading updated company logo:', uploadError);
//                 return NextResponse.json({ message: 'Failed to upload new company logo', error: (uploadError as Error).message }, { status: 500 });
//             }
//         }
//         /* // Optional: Handle explicit logo removal
//          else if (removeLogo) {
//             console.log("Request to remove company logo detected.");
//             oldLogoUrlToDelete = existingJobData.companyLogoUrl || null;
//             newCompanyLogoUrl = null; // Set URL to null in Firestore
//          }
//         */


//         // 6. Prepare Data for Firestore Update
//         const requirementsArray = requirementsString.split(',').map(item => item.trim()).filter(item => item);

//         let deadlineTimestamp: Timestamp | null = null;
//         if (deadlineString) {
//             try {
//                 const deadlineDate = new Date(deadlineString);
//                  if (!isNaN(deadlineDate.getTime())) {
//                     deadlineTimestamp = Timestamp.fromDate(deadlineDate); // Use Timestamp.fromDate for updates
//                  } else {
//                      console.warn(`Invalid deadline date string received: ${deadlineString}`);
//                  }
//             } catch (dateError) {
//                 console.error('Error parsing deadline date:', dateError);
//             }
//         } else {
//             // If deadline string is empty/null, explicitly set to null in Firestore
//             deadlineTimestamp = null;
//         }


//         const jobDataToUpdate: Partial<JobDataFromFirestore> = { // Use Partial as we only update specific fields
//             title,
//             description,
//             company,
//             location,
//             salary,
//             jobType,
//             requirements: requirementsArray,
//             deadline: deadlineTimestamp, // Use the processed timestamp or null
//              // Conditionally add/update logo URL only if it changed or was explicitly set (e.g., removed)
//             ...(newCompanyLogoUrl !== existingJobData.companyLogoUrl && { companyLogoUrl: newCompanyLogoUrl }),
//             // DO NOT update creatorId or postedDate
//         };


//         // 7. Update Firestore Document
//         await jobRef.update(jobDataToUpdate);
//         console.log(`Job ${jobId} updated successfully.`);

//         // 8. Delete Old Logo from Storage (After successful DB update)
//         if (oldLogoUrlToDelete) {
//             await deleteStorageFile(oldLogoUrlToDelete);
//         }

//         return NextResponse.json({ message: 'Job updated successfully', jobId: jobId, companyLogoUrl: newCompanyLogoUrl }, { status: 200 });

//     } catch (error) {
//         console.error(`Error updating job ${params.jobId}:`, error);
//         const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
//         return NextResponse.json({ message: 'Failed to update job', error: errorMessage }, { status: 500 });
//     }
// }







// src/app/api/v1/jobs/[jobId]/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { db, adminStorage, Timestamp } from '@/lib/firebaseAdmin'; // Import Timestamp
import { CustomJWTPayload } from '@/types/auth';
import { v4 as uuidv4 } from 'uuid'; 

interface JobDataFromFirestore {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[];
    postedDate: Timestamp; // Firestore Timestamp
    deadline?: Timestamp | null; // Firestore Timestamp
    creatorId: string;
    companyLogoUrl?: string;
}

// Helper function to safely convert Firestore Timestamps to ISO strings
// Frontend Date inputs often work better with YYYY-MM-DD or ISO strings
const serializeTimestamps = (data: Record<string, any>) => {
    const serialized: Record<string, any> = {};
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            // Format deadline specifically for <input type="date">
            if (key === 'deadline') {
                 // Convert Firestore Timestamp to JavaScript Date, then format
                 const date = data[key].toDate();
                 // Format as YYYY-MM-DD. Handle potential timezone issues if necessary.
                 // getUTCFullYear, getUTCMonth, getUTCDate might be safer depending on requirements
                 const year = date.getFullYear();
                 const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
                 const day = date.getDate().toString().padStart(2, '0');
                 serialized[key] = `${year}-${month}-${day}`;
            } else {
                // For other timestamps like postedDate, use ISO string
                serialized[key] = data[key].toDate().toISOString();
            }
        } else {
            serialized[key] = data[key];
        }
    }
    return serialized;
};


export async function GET(
    request: Request,
    context: { params: Promise< { jobId: string }> }
) {
    try {
        const {jobId} = await context.params;
        
        if (!jobId) {
            return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
        }

        // 1. Verify User Token (Optional but good practice for API consistency)
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        let userId: string | null = null;

        if (token?.value) {
            try {
                const payload = await verifyJWT(token.value) as CustomJWTPayload;
                userId = payload.uid || null;
            } catch (jwtError) {
                console.warn("JWT verification failed:", jwtError);
                // Proceed without userId, edit check will fail later if token was invalid
            }
        }

        // 2. Fetch Job Data from Firestore
        const jobRef = db.collection('jobs').doc(jobId);
        const jobDoc = await jobRef.get();

        if (!jobDoc.exists) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        const jobData = jobDoc.data() as JobDataFromFirestore;

        // 3. Check Edit Permission
        const isEditable = !!userId && jobData.creatorId === userId; // Check if logged-in user is the creator

        // 4. Serialize data (convert Timestamps for frontend)
        const serializedJobData = serializeTimestamps(jobData);

        // 5. Return Data and Edit Flag
        return NextResponse.json({
            jobData: serializedJobData,
            isEditable: isEditable
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching job details:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to fetch job details', error: errorMessage }, { status: 500 });
    }
}

// --- PUT Method (for updating) will go in the same file ---
// (See next section)


// src/app/api/v1/jobs/[jobId]/route.ts


// Helper function to get file extension (reuse from POST)
const getFileExtension = (filename: string): string => {
   return filename.substring(filename.lastIndexOf('.'));
}

// Helper function to safely delete file from storage
const deleteStorageFile = async (fileUrl: string | undefined | null) => {
    if (!fileUrl) return; // No URL, nothing to delete

    try {
        // Extract the path from the public URL
        // This assumes the URL format: https://storage.googleapis.com/your-bucket-name/path/to/file
        const urlParts = fileUrl.split('/');
        const bucketName = urlParts[2].split('.')[0]; // Or get your bucket name reliably
        const filePath = urlParts.slice(3).join('/');

        if (!filePath) {
            console.warn("Could not extract file path from URL:", fileUrl);
            return;
        }

        console.log(`Attempting to delete file: ${filePath} from bucket: ${bucketName}`);

        const bucket = adminStorage.bucket(); // Get default bucket (or specify if needed)
        const fileRef = bucket.file(decodeURIComponent(filePath)); // Decode URI component just in case

        await fileRef.delete();
        console.log(`Successfully deleted old file: ${filePath}`);
    } catch (error: any) {
        // Log deletion errors but don't necessarily fail the update
        // Common error: Object not found (code 404), which is okay if it was already deleted
        if (error.code === 404) {
            console.log(`File not found during delete (already deleted?): ${fileUrl}`);
        } else {
            console.error(`Error deleting file from storage (${fileUrl}):`, error);
        }
    }
};


export async function PUT(
    request: Request,
    context: { params: Promise< { jobId: string }> }
) {
    try {
        const {jobId} = await context.params;
        if (!jobId) {
            return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
        }

        // 1. Verify User Token and Get User ID (Required for permission check)
        const cookieStore = await cookies();
        const token = cookieStore.get('token');
        if (!token?.value) {
            return NextResponse.json({ message: 'Unauthorized: Login required' }, { status: 401 });
        }

        let payload: CustomJWTPayload;
        try {
            payload = await verifyJWT(token.value) as CustomJWTPayload;
            if (!payload.uid) {
                throw new Error('Invalid token payload');
            }
        } catch (jwtError) {
            console.error("JWT Verification failed:", jwtError);
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        const userId = payload.uid;

        // 2. Fetch Existing Job Data to Verify Ownership and get old logo URL
        const jobRef = db.collection('jobs').doc(jobId);
        const jobDoc = await jobRef.get();

        if (!jobDoc.exists) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        const existingJobData = jobDoc.data() as JobDataFromFirestore;

        // 3. --- CRUCIAL: Verify Ownership ---
        if (existingJobData.creatorId !== userId) {
            return NextResponse.json({ message: 'Forbidden: You are not authorized to edit this job' }, { status: 403 });
        }

        // 4. Process FormData
        const formData = await request.formData();
        const title = formData.get('title') as string | null;
        const description = formData.get('description') as string | null;
        const company = formData.get('company') as string | null;
        const location = formData.get('location') as string | null;
        const salary = formData.get('salary') as string | null;
        const jobType = formData.get('jobType') as string | null;
        const requirementsString = formData.get('requirements') as string | null;
        const deadlineString = formData.get('deadline') as string | null;
        const companyLogoFile = formData.get('companyLogoFile') as File | null;
        // Optional: Add a flag to explicitly remove the logo if needed
        // const removeLogo = formData.get('removeLogo') === 'true';

        // Basic validation (similar to POST)
        if (!title || !description || !company || !location || !salary || !jobType || !requirementsString) {
             return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 5. Handle File Upload (if new logo provided)
        let newCompanyLogoUrl: string | null | undefined = existingJobData.companyLogoUrl; // Default to existing
        let oldLogoUrlToDelete: string | null = null;

        if (companyLogoFile) {
            // A new logo is being uploaded, replace the old one
            console.log("New company logo file detected for update.");
            oldLogoUrlToDelete = existingJobData.companyLogoUrl || null; // Mark old logo for deletion

            try {
                const fileExtension = getFileExtension(companyLogoFile.name);
                const uniqueFilename = `${uuidv4()}${fileExtension}`;
                const filePath = `company-logos/${uniqueFilename}`;
                const bucket = adminStorage.bucket();
                const fileRef = bucket.file(filePath);
                const buffer = Buffer.from(await companyLogoFile.arrayBuffer());

                await fileRef.save(buffer, {
                    metadata: { contentType: companyLogoFile.type },
                    public: true,
                });
                newCompanyLogoUrl = fileRef.publicUrl();
                console.log(`New logo uploaded successfully: ${newCompanyLogoUrl}`);

            } catch (uploadError) {
                console.error('Error uploading updated company logo:', uploadError);
                return NextResponse.json({ message: 'Failed to upload new company logo', error: (uploadError as Error).message }, { status: 500 });
            }
        }
        /* // Optional: Handle explicit logo removal
         else if (removeLogo) {
            console.log("Request to remove company logo detected.");
            oldLogoUrlToDelete = existingJobData.companyLogoUrl || null;
            newCompanyLogoUrl = null; // Set URL to null in Firestore
         }
        */


        // 6. Prepare Data for Firestore Update
        const requirementsArray = requirementsString.split(',').map(item => item.trim()).filter(item => item);

        let deadlineTimestamp: Timestamp | null = null;
        if (deadlineString) {
            try {
                const deadlineDate = new Date(deadlineString);
                 if (!isNaN(deadlineDate.getTime())) {
                    deadlineTimestamp = Timestamp.fromDate(deadlineDate); // Use Timestamp.fromDate for updates
                 } else {
                     console.warn(`Invalid deadline date string received: ${deadlineString}`);
                 }
            } catch (dateError) {
                console.error('Error parsing deadline date:', dateError);
            }
        } else {
            // If deadline string is empty/null, explicitly set to null in Firestore
            deadlineTimestamp = null;
        }


        const jobDataToUpdate: Partial<JobDataFromFirestore> = { // Use Partial as we only update specific fields
            title,
            description,
            company,
            location,
            salary,
            jobType,
            requirements: requirementsArray,
            deadline: deadlineTimestamp, // Use the processed timestamp or null
             // Conditionally add/update logo URL only if it changed or was explicitly set (e.g., removed)
            ...(newCompanyLogoUrl !== existingJobData.companyLogoUrl && { companyLogoUrl: newCompanyLogoUrl }),
            // DO NOT update creatorId or postedDate
        };


        // 7. Update Firestore Document
        await jobRef.update(jobDataToUpdate);
        console.log(`Job ${jobId} updated successfully.`);

        // 8. Delete Old Logo from Storage (After successful DB update)
        if (oldLogoUrlToDelete) {
            await deleteStorageFile(oldLogoUrlToDelete);
        }

        return NextResponse.json({ message: 'Job updated successfully', jobId: jobId, companyLogoUrl: newCompanyLogoUrl }, { status: 200 });

    } catch (error) {
        console.error(`Error updating job :`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to update job', error: errorMessage }, { status: 500 });
    }
}