// src/types/profile.ts

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
    summary?: string;
    skills?: string[]; // Array of skill strings
    experience?: JobExperience[];
    education?: JobEducation[];
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    // Add other relevant fields as needed
    createdAt?: Date | string; // Consider Firestore Timestamp on backend
    updatedAt?: Date | string; // Consider Firestore Timestamp on backend
  }
  
  // You might also want types for the form data before validation/processing
  export type JobProfileFormData = Omit<JobProfile, 'uid' | 'createdAt' | 'updatedAt'>;