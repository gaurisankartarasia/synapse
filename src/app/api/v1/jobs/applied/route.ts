// // src/app/api/applications/list/route.ts
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyJWT } from '@/lib/jwt';
// import { db } from '@/lib/firebaseAdmin';
// import { CustomJWTPayload } from '@/types/auth';

// export async function GET() {
//     try {
//         // Verify User Authentication
//         const cookieStore = await cookies();
//         const token = cookieStore.get('token');

//         if (!token?.value) {
//             return NextResponse.json(
//                 { error: 'Unauthorized' },
//                 { status: 401 }
//             );
//         }

//         const payload = await verifyJWT(token.value) as CustomJWTPayload;

//         if (!payload.uid) {
//             return NextResponse.json(
//                 { error: 'Invalid token payload' },
//                 { status: 401 }
//             );
//         }

//         // Fetch applications submitted by the user
//         const jobsSnapshot = await db.collectionGroup('applications')
//             .where('applicantId', '==', payload.uid)
//             .orderBy('applicationDate', 'desc')
//             .get();

//         const applications = jobsSnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));

//         return NextResponse.json(applications, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching applied jobs:', error);
//         return NextResponse.json({ error: 'Failed to fetch applied jobs' }, { status: 500 });
//     }
// }



// src/app/api/v1/jobs/applied/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import { CustomJWTPayload } from '@/types/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { JobDocumentData } from '@/types/Job/job';

interface Application {
  applicationId: string;
  jobId: string;
  applicationDate: Timestamp | string;
  status?: string;
  // other application fields that might be useful
}

interface JobWithApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  postedDate: string;
  deadline: string | null;
  companyLogoUrl: string | null;
  applicationId: string;
  applicationDate: string;
  applicationStatus?: string;
  // You can include more fields as needed
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload?.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const uid = payload.uid;
    
    // Get pagination parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;
    
    // Collection references for batch operations
    const jobsCollection = db.collection('jobs');
    
    // Array to hold the job applications data with job details
    const appliedJobs: JobWithApplication[] = [];
    let totalApplications = 0;
    
    // Step 1: Find all applications by the user
    try {
      // Query all job documents
      const jobsSnapshot = await jobsCollection.get();
      const jobDocs = jobsSnapshot.docs;
      
      // For each job, check if the user has applied
      for (const jobDoc of jobDocs) {
        const jobId = jobDoc.id;
        const applicationsRef = jobDoc.ref.collection('applications');
        
        // Query applications with the user's ID
        const applicationsQuery = applicationsRef.where('applicantId', '==', uid);
        const applicationsSnapshot = await applicationsQuery.get();
        
        if (!applicationsSnapshot.empty) {
          totalApplications += applicationsSnapshot.size;
          
          // Process each application
          for (const appDoc of applicationsSnapshot.docs) {
            const appData = appDoc.data() as Application;
            const jobData = jobDoc.data() as JobDocumentData;
            
            // Convert timestamps to ISO strings
            const postedDateISO = jobData.postedDate instanceof Timestamp
              ? jobData.postedDate.toDate().toISOString()
              : (typeof jobData.postedDate === 'string' ? jobData.postedDate : new Date().toISOString());
            
            const deadlineISO = jobData.deadline instanceof Timestamp
              ? jobData.deadline.toDate().toISOString()
              : (typeof jobData.deadline === 'string' ? jobData.deadline : null);
            
            const applicationDateISO = appData.applicationDate instanceof Timestamp
              ? appData.applicationDate.toDate().toISOString()
              : (typeof appData.applicationDate === 'string' ? appData.applicationDate : new Date().toISOString());
            
            // Add to applied jobs array
            appliedJobs.push({
              id: jobId,
              title: jobData.title || 'N/A',
              company: jobData.company || 'N/A',
              location: jobData.location || 'Remote',
              jobType: jobData.jobType || 'Full-time',
              salary: jobData.salary || 'Not Specified',
              postedDate: postedDateISO,
              deadline: deadlineISO,
              companyLogoUrl: jobData.companyLogoUrl || null,
              applicationId: appDoc.id,
              applicationDate: applicationDateISO,
              applicationStatus: appData.status || 'Pending'
            });
          }
        }
      }
      
      // Sort by application date (newest first)
      appliedJobs.sort((a, b) => 
        new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
      );
      
      // Apply pagination
      const paginatedJobs = appliedJobs.slice(offset, offset + limit);
      
      return NextResponse.json({
        jobs: paginatedJobs,
        pagination: {
          total: totalApplications,
          page,
          limit,
          totalPages: Math.ceil(totalApplications / limit)
        }
      }, { status: 200 });
      
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applied jobs' },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Applied jobs fetch error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}