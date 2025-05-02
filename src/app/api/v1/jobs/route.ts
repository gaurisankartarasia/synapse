// // src/app/api/jobs/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/firebaseAdmin'; // Use Admin SDK
// import { Timestamp } from 'firebase-admin/firestore'; // Import Timestamp from admin SDK
// import { Job } from '@/types/Job/job'; // Import your Job interface

// // Helper to ensure data sent back to client is serializable
// // Handles Firestore Timestamps specifically from the Admin SDK
// const ensureSerializableServer = (data: FirebaseFirestore.DocumentData): Omit<Job, 'id'> => {
//   const serializableData = { ...data };
//   for (const key in serializableData) {
//     if (serializableData[key] instanceof Timestamp) {
//       serializableData[key] = serializableData[key].toDate().toISOString();
//     }
//     // Add checks for other non-serializable types if necessary
//   }
//   // Ensure requirements is always an array
//   serializableData.requirements = Array.isArray(data.requirements)
//     ? data.requirements
//     : [data.requirements].filter(Boolean);

//   // Ensure postedDate exists and is a string
//   if (!serializableData.postedDate) {
//       serializableData.postedDate = new Date().toISOString();
//   } else if (serializableData.postedDate instanceof Date) { // Should have been converted above if Timestamp
//       serializableData.postedDate = serializableData.postedDate.toISOString();
//   }


//   // Cast to the Job type (excluding id which is added separately)
//   // Perform any necessary type checks or defaults here
//   return serializableData as Omit<Job, 'id'>;
// };


// // --- GET Handler: Fetch all Jobs ---
// export async function GET(request: NextRequest) {
//   try {
//     const jobsCollection = db.collection('jobs');
//     // Optional: Add ordering, e.g., by postedDate
//     const querySnapshot = await jobsCollection.orderBy('postedDate', 'desc').get();

//     const jobs: Job[] = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...ensureSerializableServer(doc.data())
//     }));

//     return NextResponse.json({ jobs });

//   } catch (error: any) {
//     console.error('Error fetching jobs:', error);
//     return NextResponse.json({ error: 'Failed to fetch jobs', details: error.message }, { status: 500 });
//   }
// }


// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Use Admin SDK
import { Timestamp } from 'firebase-admin/firestore'; // Import Timestamp from admin SDK
import { Job } from '@/types/Job/job'; // Import your Job interface

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


// --- GET Handler: Fetch all Jobs with Creator Info ---
export async function GET(request: NextRequest) {
  try {
    const jobsCollection = db.collection('jobs');
    const querySnapshot = await jobsCollection.orderBy('postedDate', 'desc').get();

    const jobsWithCreator = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const jobData = ensureSerializableServer(doc.data());
        const creatorId = jobData.creatorId;

        let username = '';
        if (creatorId) {
          try {
            const userDoc = await db.collection('users').doc(creatorId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              username = userData?.username || '';
            }
          } catch (err) {
            console.warn(`Could not fetch username for creatorId: ${creatorId}`, err);
          }
        }

        return {
          id: doc.id,
          ...jobData,
          creator: {
            uid: creatorId,
            username,
          },
        };
      })
    );

    return NextResponse.json({ jobs: jobsWithCreator });

  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs', details: error.message }, { status: 500 });
  }
}


