// components/PrivacyToggle.tsx
'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function PrivacyToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const res = await fetch('/api/user/privacy/account_privacy');
        const data = await res.json();
        setEnabled(data.isPrivate);
      } catch (error) {
        console.error('Failed to fetch privacy status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacy();
  }, []);

  const handleToggle = async (newValue: boolean) => { // Directly accept boolean
    try {
      setEnabled(newValue);
      await fetch('/api/user/privacy/account_privacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPrivate: newValue }),
      });
    } catch (error) {
      console.error('Failed to update privacy status:', error);
      setEnabled(!newValue); // Revert on error
    }
  };

  if (loading) return <div>Loading privacy settings...</div>;

  return (
    <div className=" p-6 "  >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Private Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Account privacy status
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle} 
         
        >
          <span
            className={`${enabled ? 'translate-x-6' : 'translate-x-1'}
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </div>
  );
}