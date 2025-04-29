// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Use Admin SDK
import { Timestamp } from 'firebase-admin/firestore'; // Import Timestamp from admin SDK
import { Job } from '@/redux/features/jobSlice'; // Import your Job interface

// Helper to ensure data sent back to client is serializable
// Handles Firestore Timestamps specifically from the Admin SDK
const ensureSerializableServer = (data: FirebaseFirestore.DocumentData): Omit<Job, 'id'> => {
  const serializableData = { ...data };
  for (const key in serializableData) {
    if (serializableData[key] instanceof Timestamp) {
      serializableData[key] = serializableData[key].toDate().toISOString();
    }
    // Add checks for other non-serializable types if necessary
  }
  // Ensure requirements is always an array
  serializableData.requirements = Array.isArray(data.requirements)
    ? data.requirements
    : [data.requirements].filter(Boolean);

  // Ensure postedDate exists and is a string
  if (!serializableData.postedDate) {
      serializableData.postedDate = new Date().toISOString();
  } else if (serializableData.postedDate instanceof Date) { // Should have been converted above if Timestamp
      serializableData.postedDate = serializableData.postedDate.toISOString();
  }


  // Cast to the Job type (excluding id which is added separately)
  // Perform any necessary type checks or defaults here
  return serializableData as Omit<Job, 'id'>;
};


// --- GET Handler: Fetch all Jobs ---
export async function GET(request: NextRequest) {
  try {
    const jobsCollection = db.collection('jobs');
    // Optional: Add ordering, e.g., by postedDate
    const querySnapshot = await jobsCollection.orderBy('postedDate', 'desc').get();

    const jobs: Job[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...ensureSerializableServer(doc.data())
    }));

    return NextResponse.json({ jobs });

  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs', details: error.message }, { status: 500 });
  }
}

// --- POST Handler: Create a new Job ---
export async function POST(request: NextRequest) {
  try {
    const jobData: Omit<Job, 'id'> = await request.json();

    // --- Basic Server-Side Validation (Recommended) ---
    if (!jobData.title || !jobData.company || !jobData.creatorId) {
       return NextResponse.json({ error: 'Missing required job fields (title, company, creatorId)' }, { status: 400 });
    }

    // Prepare data for Firestore (handle dates, ensure arrays, etc.)
    const dataToSave = {
      ...jobData,
      // Ensure requirements is an array
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [jobData.requirements].filter(Boolean),
      // Convert ISO string date back to Firestore Timestamp or Date object if needed
      // Firestore Admin SDK generally handles Date objects well.
      postedDate: jobData.postedDate ? new Date(jobData.postedDate) : new Date(),
      // Remove deadline if it's undefined or null to avoid storing it
      ...(jobData.deadline && { deadline: new Date(jobData.deadline) }),
    };
    // Remove undefined fields before saving if necessary
    Object.keys(dataToSave).forEach(key => dataToSave[key as keyof typeof dataToSave] === undefined && delete dataToSave[key as keyof typeof dataToSave])


    const jobsCollection = db.collection('jobs');
    const docRef = await jobsCollection.add(dataToSave);

    // Get the newly created document to return it
    const newDocSnap = await docRef.get();

    if (!newDocSnap.exists) {
        throw new Error('Failed to retrieve created job document after creation.');
    }

    const createdJob: Job = {
        id: newDocSnap.id,
        ...ensureSerializableServer(newDocSnap.data()!) // Use ! because we know it exists
    };

    return NextResponse.json(createdJob, { status: 201 }); // 201 Created status

  } catch (error: any) {
    console.error('Error creating job:', error);
     if (error instanceof SyntaxError) { // JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create job', details: error.message }, { status: 500 });
  }
}