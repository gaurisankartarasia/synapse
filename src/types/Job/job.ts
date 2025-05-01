// src/types/index.ts
import { Timestamp } from "firebase/firestore";

export interface Job {
  id?: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  requirements: string | string[];
  postedDate: string;
  deadline?: string;
  creatorId: string;
}

export interface JobForm {
  fullName: string;
  email: string;
  phone?: string;
  resume: FileList;
  coverLetter?: string;
  portfolio?: string;
  jobId?: string;
}


export interface JobDocumentData {
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[];
    postedDate: Timestamp; // Firestore Timestamp
    deadline?: Timestamp | null; // Optional Firestore Timestamp
    creatorId: string;
    companyLogoUrl?: string | null;
}

// Define the structure of the Job data to be sent in the API response
// Timestamps are converted to strings for JSON serialization
export interface JobApiResponse {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
    requirements: string[];
    postedDate: string; // ISO string date
    deadline?: string | null; // Optional ISO string date
    creatorId: string; // Keep creatorId? Decide if needed on the frontend
    companyLogoUrl?: string | null;
    isSavedByUser: boolean;

    viewer: {
        uid: string | null; 
    }
}
