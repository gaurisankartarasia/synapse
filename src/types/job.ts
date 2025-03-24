// src/types/index.ts
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