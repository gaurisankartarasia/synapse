// src/utils/profileCompletionCalculator.ts
import { JobProfile } from '@/types/Job/JobProfile';

/**
 * Calculates the completion percentage of a job profile
 * @param profile The job profile to calculate completion for
 * @returns A number between 0-100 representing completion percentage
 */
export function calculateProfileCompletion(profile: JobProfile): number {
  // Define weights for different sections (sum = 100)
  const weights = {
    basicInfo: 25, // Headline, email, summary
    skills: 15,    // Skills list
    resume: 10,    // Resume URL
    experience: 20, // Work experience
    education: 15, // Education history
    links: 15,     // Portfolio, LinkedIn, GitHub URLs
  };

  let completionScore = 0;

  // Basic Info (25%)
  if (profile.headline?.trim()) completionScore += weights.basicInfo * 0.4;
  if (profile.email?.trim()) completionScore += weights.basicInfo * 0.3;
  if (profile.summary?.trim()) completionScore += weights.basicInfo * 0.3;

  // Skills (15%)
  if (profile.skills?.length) {
    // Give partial credit based on number of skills (up to 5 for full credit)
    const skillsPercentage = Math.min(profile.skills.length / 5, 1);
    completionScore += weights.skills * skillsPercentage;
  }

  // Resume (10%)
  if (profile.resumeUrl?.trim()) completionScore += weights.resume;

  // Experience (20%)
  if (profile.experience?.length) {
    // Each experience entry gets partial credit, up to 2 for full credit
    const experiencePercentage = Math.min(profile.experience.length / 2, 1);
    
    // Calculate how complete each experience entry is
    let experienceDetailScore = 0;
    profile.experience.forEach(exp => {
      let entryScore = 0;
      if (exp.title?.trim()) entryScore += 0.3;
      if (exp.company?.trim()) entryScore += 0.3;
      if (exp.startDate) entryScore += 0.2;
      if (exp.description?.trim()) entryScore += 0.2;
      experienceDetailScore += entryScore;
    });
    
    // Average the completeness of entries
    const avgExperienceCompleteness = profile.experience.length > 0 
      ? experienceDetailScore / profile.experience.length 
      : 0;
    
    completionScore += weights.experience * experiencePercentage * avgExperienceCompleteness;
  }

  // Education (15%)
  if (profile.education?.length) {
    // Each education entry gets partial credit, up to 2 for full credit
    const educationPercentage = Math.min(profile.education.length / 2, 1);
    
    // Calculate how complete each education entry is
    let educationDetailScore = 0;
    profile.education.forEach(edu => {
      let entryScore = 0;
      if (edu.institution?.trim()) entryScore += 0.3;
      if (edu.degree?.trim()) entryScore += 0.3;
      if (edu.startDate) entryScore += 0.2;
      if (edu.fieldOfStudy?.trim()) entryScore += 0.2;
      educationDetailScore += entryScore;
    });
    
    // Average the completeness of entries
    const avgEducationCompleteness = profile.education.length > 0 
      ? educationDetailScore / profile.education.length 
      : 0;
    
    completionScore += weights.education * educationPercentage * avgEducationCompleteness;
  }

  // Links (15%) - Give credit for each link
  let linksScore = 0;
  if (profile.portfolioUrl?.trim()) linksScore += 0.33;
  if (profile.linkedinUrl?.trim()) linksScore += 0.33;
  if (profile.githubUrl?.trim()) linksScore += 0.34;
  completionScore += weights.links * linksScore;

  // Round to nearest whole number
  return Math.round(completionScore);
}