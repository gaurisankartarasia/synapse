'use client';

import { useState } from 'react';
import { auth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from '@/lib/firebaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardHeader, CardFooter, CardDescription } from '@/components/ui/card';
import Link from 'next/link';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // Check if email is registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length === 0) {
        setMessage('If an account exists, you will receive a password reset email.');
        return;
      }

      // Send reset email if user exists
      await sendPasswordResetEmail(auth, email);
      setMessage('If an account exists, you will receive a password reset email.');
    } catch (err: any) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full space-y-8">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                className="mt-1 block w-full p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full flex justify-center py-2 px-4" disabled={loading}>
              {loading ? 'Processing...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Remembered your password?{' '}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
