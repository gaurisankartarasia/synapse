// src/app/applied-jobs/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Application {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    resumeUrl?: string;
    coverLetter?: string;
    portfolio?: string;
    applicationDate: string;
}

export default function AppliedJobsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchApplications() {
            try {
                const response = await fetch('/api/v1/jobs/applied');
                if (!response.ok) throw new Error('Failed to fetch applications');
                const data = await response.json();
                setApplications(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Applied Jobs</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {applications.map(app => (
                    <li key={app.id} className="border p-4 rounded-lg mb-2">
                        <p><strong>Name:</strong> {app.fullName}</p>
                        <p><strong>Email:</strong> {app.email}</p>
                        {app.phone && <p><strong>Phone:</strong> {app.phone}</p>}
                        {app.resumeUrl && <p><a href={app.resumeUrl} target="_blank" className="text-blue-500">View Resume</a></p>}
                        {app.coverLetter && <p><strong>Cover Letter:</strong> {app.coverLetter}</p>}
                        {app.portfolio && <p><strong>Portfolio:</strong> <a href={app.portfolio} target="_blank" className="text-blue-500">View</a></p>}
                        <p><strong>Applied On:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
