// src/app/account-type/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  profilePhotoURL?: string;
  username?: string;
  displayName?: string;
  isVerified?: boolean;
  account_type?: string;
}

const AccountTypePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/my_profile/query');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data.user);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleAccountTypeChange = async (accountType: string) => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`/api/user/account/account_type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountType }),
      });

      if (!response.ok) {
        throw new Error('Failed to update account type');
      }

      setUser({ ...user, account_type: accountType });
    //   router.push('/profile'); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Set Account Type</h1>
      {user && (
        <div>
          <p>Current Account Type: {user.account_type || 'Not set'}</p>
          <button onClick={() => handleAccountTypeChange('ppersonal')}>Personal</button>
          <button onClick={() => handleAccountTypeChange('business')}>Business</button>
          <button onClick={() => handleAccountTypeChange('digital_creator')}>Digital Creator</button>
        </div>
      )}
    </div>
  );
};

export default AccountTypePage;
