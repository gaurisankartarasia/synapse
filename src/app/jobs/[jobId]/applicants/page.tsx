// src/app/dashboard/jobs/[jobId]/applicants/page.tsx
"use client"; // Required for using hooks like useState, useEffect, useParams

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Hook to get route parameters
import Link from 'next/link';

// Define the Application type matching the API response and Firestore structure
// Ideally, import this from a shared types file (e.g., '@/types/Job/Application')
interface Application {
  applicationId: string;
  applicantId: string;
  applicationDate: string; // ISO String format
  fullName: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  // Add other fields as needed
  skills?: string[] | null;
  portfolio?: string | null;
}

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = params.jobId as string; // Get jobId from URL

  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return; // Don't fetch if jobId is not available yet

    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/jobs/${jobId}/applicants`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch applicants: ${response.statusText}`);
        }

        const data: { applicants: Application[] } = await response.json();
        setApplicants(data.applicants);

      } catch (err: any) {
        console.error("Error fetching applicants:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();

  }, [jobId]); // Re-run effect if jobId changes

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-sm font-bold mb-4">Applicants for Job ID: {jobId}</h1>

      {loading && (
        <div className="text-center py-4">
          <p>Loading applicants...</p>
          {/* Optional: Add a spinner component */}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && applicants.length === 0 && (
        <p className="text-gray-600">No applicants found for this job yet.</p>
      )}

      {!loading && !error && applicants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Full Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Phone</th>
                <th className="py-2 px-4 border-b text-left">Application Date</th>
                <th className="py-2 px-4 border-b text-left">Resume</th>
                <th className="py-2 px-4 border-b text-left">Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.applicationId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{applicant.fullName}</td>
                  <td className="py-2 px-4 border-b">
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email}
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b">{applicant.phone || 'N/A'}</td>
                   <td className="py-2 px-4 border-b">
                     {new Date(applicant.applicationDate).toLocaleDateString()} {/* Format date */}
                   </td>
                  <td className="py-2 px-4 border-b">
                    {applicant.resumeUrl ? (
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {applicant.resumeFileName || 'View Resume'}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                     {applicant.portfolio ? (
                       <a
                         href={applicant.portfolio} // Ensure portfolio URL has protocol (http/https)
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-blue-600 hover:underline"
                       >
                         View Portfolio
                       </a>
                     ) : (
                       'N/A'
                     )}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
     
    </div>
  );
}