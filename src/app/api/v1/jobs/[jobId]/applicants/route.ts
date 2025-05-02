

// // src/app/api/v1/jobs/[jobId]/applicants/route.ts

// import { NextResponse, NextRequest } from "next/server";

// import { cookies } from "next/headers";

// import { FieldValue, Timestamp } from "firebase-admin/firestore"; // Keep Timestamp import for conversion logic

// import { verifyJWT } from "@/lib/jwt";

// import { db } from "@/lib/firebaseAdmin";

// import { CustomJWTPayload } from "@/types/auth";

// // Define the Application type matching the expected final structure

// // Ensure this matches or is compatible with the frontend type definition

// interface Application {
//   applicationId: string; // Crucial: This will hold the Firestore document ID

//   applicantId: string;

//   applicationDate: string; // ISO String format

//   fullName: string;

//   email: string;

//   phone?: string | null;

//   resumeUrl?: string | null;

//   resumeFileName?: string | null;

//   coverLetter?: string | null;

//   portfolio?: string | null;

//   education?: any[] | null;

//   experience?: any[] | null;

//   skills?: string[] | null;

//   // Add other fields as needed based on your Firestore structure
// }

// // Helper function to convert Firestore Timestamp to ISO string (recursive)

// const convertTimestamps = (data: any): any => {
//   if (data instanceof Timestamp) {
//     return data.toDate().toISOString();
//   }

//   if (Array.isArray(data)) {
//     return data.map(convertTimestamps);
//   }

//   // Check for Firestore FieldValue types if needed (e.g., FieldValue.serverTimestamp())

//   // Although usually you'd read timestamps, not FieldValues directly after writing

//   if (
//     data !== null &&
//     typeof data === "object" &&
//     !(data instanceof FieldValue)
//   ) {
//     // Avoid trying to iterate over FieldValue

//     const newObj: { [key: string]: any } = {};

//     for (const key in data) {
//       if (Object.prototype.hasOwnProperty.call(data, key)) {
//         newObj[key] = convertTimestamps(data[key]);
//       }
//     }

//     return newObj;
//   }

//   return data;
// };

// // --- GET Handler: Fetch Applicants for a Specific Job ---

// export async function GET(
//   request: NextRequest,

//   { params }: { params: { jobId: string } }
// ) {
//   try {
//     const cookieStore = await cookies();

//     const token = cookieStore.get("token");

//     if (!token?.value) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

//     if (!payload?.uid) {
//       return NextResponse.json(
//         { error: "Invalid token payload" },
//         { status: 401 }
//       );
//     }

//     const { jobId } = params;

//     if (!jobId) {
//       return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
//     }

//     // --- Optional Authorization Check ---

//     // Consider adding logic here to verify if payload.uid is allowed to see applicants for jobId

//     // Example: Check if payload.uid matches a 'recruiterId' or 'postedBy' field on the job document.

//     // const jobRef = db.collection('jobs').doc(jobId);

//     // const jobDoc = await jobRef.get();

//     // if (!jobDoc.exists || jobDoc.data()?.postedBy !== payload.uid) {

//     //    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

//     // }

//     // --- End Optional Check ---

//     // --- Fetch Applications ---

//     const applicationsRef = db
//       .collection("jobs")
//       .doc(jobId)
//       .collection("applications");

//     const applicationsSnapshot = await applicationsRef
//       .orderBy("applicationDate", "desc")
//       .get();

//     if (applicationsSnapshot.empty) {
//       return NextResponse.json({ applicants: [] }, { status: 200 });
//     }

//     // --- CORRECTED MAPPING ---

//     // Map Firestore documents to Application objects, ensuring applicationId is included

//     const applicants = applicationsSnapshot.docs.map((doc) => {
//       const data = doc.data(); // Get the fields inside the document

//       const processedData = convertTimestamps(data); // Convert any Timestamps to ISO strings

//       // Combine the document's internal data with its unique Firestore ID

//       return {
//         ...processedData, // Spread all fields from within the document

//         applicationId: doc.id, // Use the Firestore document ID as the applicationId
//       } as Application; // Cast the final object to the Application type
//     });

//     // --- END CORRECTION ---

//     return NextResponse.json({ applicants }, { status: 200 });
//   } catch (error: any) {
//     console.error(`Error fetching applicants for job ${params?.jobId}:`, error);

//     if (
//       error.name === "JsonWebTokenError" ||
//       error.name === "TokenExpiredError"
//     ) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (error.code === "invalid-argument") {
//       // Handle potential Firestore errors

//       return NextResponse.json(
//         { error: "Invalid Job ID format" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

















// src/app/api/v1/jobs/[jobId]/applicants/route.ts

import { NextResponse, NextRequest } from "next/server";

import { cookies } from "next/headers";

import { FieldValue, Timestamp } from "firebase-admin/firestore"; // Keep Timestamp import for conversion logic

import { verifyJWT } from "@/lib/jwt";

import { db } from "@/lib/firebaseAdmin";

import { CustomJWTPayload } from "@/types/auth";

// Define the Application type matching the expected final structure

// Ensure this matches or is compatible with the frontend type definition

interface Application {
  applicationId: string; // Crucial: This will hold the Firestore document ID

  applicantId: string;

  applicationDate: string; // ISO String format

  fullName: string;

  email: string;

  phone?: string | null;

  resumeUrl?: string | null;

  resumeFileName?: string | null;

  coverLetter?: string | null;

  portfolio?: string | null;

  education?: any[] | null;

  experience?: any[] | null;

  skills?: string[] | null;

  // Add other fields as needed based on your Firestore structure
}

// Helper function to convert Firestore Timestamp to ISO string (recursive)

const convertTimestamps = (data: any): any => {
  if (data instanceof Timestamp) {
    return data.toDate().toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(convertTimestamps);
  }

  // Check for Firestore FieldValue types if needed (e.g., FieldValue.serverTimestamp())

  // Although usually you'd read timestamps, not FieldValues directly after writing

  if (
    data !== null &&
    typeof data === "object" &&
    !(data instanceof FieldValue)
  ) {
    // Avoid trying to iterate over FieldValue

    const newObj: { [key: string]: any } = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObj[key] = convertTimestamps(data[key]);
      }
    }

    return newObj;
  }

  return data;
};

// --- GET Handler: Fetch Applicants for a Specific Job ---

export async function GET(
  request: NextRequest,

  context: { params: Promise< { jobId: string }> }
) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");

    if (!token?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload?.uid) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    // --- Optional Authorization Check ---

    // Consider adding logic here to verify if payload.uid is allowed to see applicants for jobId

    // Example: Check if payload.uid matches a 'recruiterId' or 'postedBy' field on the job document.

    // const jobRef = db.collection('jobs').doc(jobId);

    // const jobDoc = await jobRef.get();

    // if (!jobDoc.exists || jobDoc.data()?.postedBy !== payload.uid) {

    //    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // }

    // --- End Optional Check ---

    // --- Fetch Applications ---

    const applicationsRef = db
      .collection("jobs")
      .doc(jobId)
      .collection("applications");

    const applicationsSnapshot = await applicationsRef
      .orderBy("applicationDate", "desc")
      .get();

    if (applicationsSnapshot.empty) {
      return NextResponse.json({ applicants: [] }, { status: 200 });
    }

    // --- CORRECTED MAPPING ---

    // Map Firestore documents to Application objects, ensuring applicationId is included

    const applicants = applicationsSnapshot.docs.map((doc) => {
      const data = doc.data(); // Get the fields inside the document

      const processedData = convertTimestamps(data); // Convert any Timestamps to ISO strings

      // Combine the document's internal data with its unique Firestore ID

      return {
        ...processedData, // Spread all fields from within the document

        applicationId: doc.id, // Use the Firestore document ID as the applicationId
      } as Application; // Cast the final object to the Application type
    });

    // --- END CORRECTION ---

    return NextResponse.json({ applicants }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching applicants for job :`, error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.code === "invalid-argument") {
      // Handle potential Firestore errors

      return NextResponse.json(
        { error: "Invalid Job ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
