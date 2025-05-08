// // src/types/JobProfile.ts

// export interface JobExperience {
//     id: string; // For key prop in React lists
//     title: string;
//     company: string;
//     location?: string; // Optional
//     startDate: string; // Consider using Date objects or ISO strings
//     endDate?: string | null; // Null if current
//     description?: string;
//   }
  
//   export interface JobEducation {
//     id: string; // For key prop in React lists
//     institution: string;
//     degree: string;
//     fieldOfStudy?: string;
//     startDate: string;
//     endDate?: string | null;
//     description?: string;
//   }
  
//   export interface JobProfile {
//     uid?: string; // Associated user ID (optional on frontend input, required on backend)
//     headline?: string;
//     phone?:number;
//     email?: string; 
//     summary?: string;
//     skills?: string[]; 
//     resumeUrl?: string; 
//     coverLetter?: string;
//     experience?: JobExperience[];
//     education?: JobEducation[];
//     portfolioUrl?: string;
//     linkedinUrl?: string;
//     githubUrl?: string;
//     createdAt?: Date | string; // Consider Firestore Timestamp on backend
//     updatedAt?: Date | string; // Consider Firestore Timestamp on backend
//   }
  
//   // You might also want types for the form data before validation/processing
//   export type JobProfileFormData = Omit<JobProfile, 'uid' | 'createdAt' | 'updatedAt'>;










// src/types/Job/JobProfile.ts

export interface JobExperience {
  id: string; // For key prop in React lists
  title: string;
  company: string;
  location?: string; // Optional
  startDate: string; // Consider using Date objects or ISO strings
  endDate?: string | null; // Null if current
  description?: string;
}

export interface JobEducation {
  id: string; // For key prop in React lists
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
  description?: string;
}

export interface JobProfile {
  uid?: string; // Associated user ID (optional on frontend input, required on backend)
  headline?: string;
 phone?: number;
  email?: string;
  summary?: string;
  skills?: string[];
  // ++ Add resumeUrl field ++
  resumeUrl?: string; // URL of the uploaded resume file
  experience?: JobExperience[];
  education?: JobEducation[];
  coverLetter?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  createdAt?: any; // Use 'any' for Firestore Timestamp compatibility if needed, or specific type
  updatedAt?: any; // Use 'any' for Firestore Timestamp compatibility if needed, or specific type
}

// This type should automatically include the new fields
export type JobProfileFormData = Omit<JobProfile, 'uid' | 'createdAt' | 'updatedAt'>;

// Type for the data sent TO the profile save API (POST /api/v1/user/job-profile)
// Needs to include the new fields as well
export type JobProfileApiPayload = Omit<JobProfileFormState, 'experience' | 'education' | 'id'> & { // Ensure 'id' isn't accidentally included
  experience?: Omit<JobExperience, 'id'>[];
  education?: Omit<JobEducation, 'id'>[];
  // ++ Add potentially updated fields ++
  email?: string;
  resumeUrl?: string; // Send the final URL
};

// Type for the internal form state, including temporary IDs and potentially the resume file object
export type JobProfileFormState = Omit<JobProfile, 'uid' | 'createdAt' | 'updatedAt' | 'experience' | 'education' | 'skills'> & {
  id?: string; // Keep internal ID if needed, though not usually top-level
  skills: string[];
  experience: JobExperience[]; // Items MUST have 'id' for React keys
  education: JobEducation[];   // Items MUST have 'id' for React keys
  // ++ Add email state ++
  email: string;
  // ++ Add resumeUrl state ++
  resumeUrl: string; // Store the current/new resume URL
};