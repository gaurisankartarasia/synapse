// src/app/jobs/search/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Job {
    id: string;
    title: string;
    description: string;
    company: string;
    companyLogoUrl:string;
}

export default function JobSearchPage() {
    const [query, setQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/v1/jobs/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setJobs(data.jobs);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Search</h1>
            <div className="mb-4 flex">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for jobs..."
                    className="border p-2 rounded w-full"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                    Search
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {jobs.map(job => (
                    <li key={job.id} className="border p-4 rounded-lg mb-2">
                <Link href={`/jobs/apply/${job.id}`}>

                <Image src={job.companyLogoUrl} alt='logo' width={60} height={60} />
                        <h2 className="text-lg font-bold">{job.title}</h2>
                        <p className="text-gray-700">{job.description}</p>
                        <p className="text-sm text-gray-500">{job.company}</p>
</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}




