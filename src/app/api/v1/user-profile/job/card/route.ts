// src/app/api/v1/user/job-profile/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { FieldValue } from 'firebase-admin/firestore';

import { verifyJWT } from '@/lib/jwt';
import { db } from '@/lib/firebaseAdmin';
import { CustomJWTPayload } from '@/types/auth';
import { JobProfile, JobProfileApiPayload } from '@/types/Job/JobProfile';
import { z } from 'zod';
import { calculateProfileCompletion } from '@/utils/profileCompletionCalculator';

// --- Zod Schema for Validation (No changes) ---
const JobExperienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Start date must be YYYY-MM"),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, "End date must be YYYY-MM").nullable().optional(),
  description: z.string().optional(),
});

const JobEducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Start date must be YYYY-MM"),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, "End date must be YYYY-MM").nullable().optional(),
  description: z.string().optional(),
});

const JobProfilePayloadSchema = z.object({
  headline: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  resumeUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  experience: z.array(JobExperienceSchema).optional().default([]),
  education: z.array(JobEducationSchema).optional().default([]),
  portfolioUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  linkedinUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
  githubUrl: z.string().url("Invalid URL format").optional().or(z.literal('')),
});

// --- GET Handler (Updated to include completion percentage) ---
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload?.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const profileRef = db.collection('jobProfiles').doc(payload.uid);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      // Return an empty profile object
      const emptyProfile: Partial<JobProfile> = {
        headline: '',
        email: '',
        summary: '',
        skills: [],
        resumeUrl: '',
        experience: [],
        education: [],
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: '',
      };
      
      // Calculate completion percentage for empty profile (will be 0)
      const completionPercentage = calculateProfileCompletion(emptyProfile as JobProfile);
      
      return NextResponse.json({ 
        profile: emptyProfile as JobProfile,
        completionPercentage
      });
    }

    const profileData = profileDoc.data() as JobProfile;

    // Ensure all fields expected by the frontend are present
    const fullProfileData: JobProfile = {
      headline: '',
      email: '',
      summary: '',
      skills: [],
      resumeUrl: '',
      experience: [],
      education: [],
      portfolioUrl: '',
      linkedinUrl: '',
      githubUrl: '',
      ...profileData,
    };

    // Calculate profile completion percentage
    const completionPercentage = calculateProfileCompletion(fullProfileData);

    return NextResponse.json({ 
      profile: fullProfileData,
      completionPercentage
    });

  } catch (error: any) {
    console.error('Job Profile fetch error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- POST Handler (Updated to include completion percentage) ---
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await verifyJWT(token.value)) as CustomJWTPayload;

    if (!payload?.uid) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const profileData = (await request.json()) as JobProfileApiPayload;

    // Server-Side Validation using Zod
    const validationResult = JobProfilePayloadSchema.safeParse(profileData);
    if (!validationResult.success) {
      console.error("Validation Errors:", validationResult.error.errors);
      return NextResponse.json(
        { error: 'Invalid profile data', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const validatedData = validationResult.data;
    const profileRef = db.collection('jobProfiles').doc(payload.uid);

    // Prepare data for saving
    const dataToSave = {
      ...validatedData,
      uid: payload.uid,
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Check if the document exists to conditionally set createdAt
    const docSnapshot = await profileRef.get();
    if (!docSnapshot.exists) {
      (dataToSave as any).createdAt = FieldValue.serverTimestamp();
    }

    // Save the document
    await profileRef.set(dataToSave, { merge: true });

    // Fetch the newly saved/updated data
    const updatedDoc = await profileRef.get();
    const updatedProfile = updatedDoc.data() as JobProfile;

    // Calculate completion percentage
    const completionPercentage = calculateProfileCompletion(updatedProfile);

    return NextResponse.json({ 
      profile: updatedProfile,
      completionPercentage
    }, { status: 200 });

  } catch (error: any) {
    console.error('Job Profile save error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}