
// src/app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { signUpWithEmail } from '@/redux/features/authSlice';
import GoogleSignInButton from '../signin/GoogleSignInButton';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {  CardContent, CardTitle, CardHeader, CardFooter, CardDescription } from '@/components/ui/card';

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      const resultAction = await dispatch(signUpWithEmail({ email, password, username }));
      if (signUpWithEmail.fulfilled.match(resultAction)) {
        router.push(`/${username}`);
      }
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center lg:mr-64">
      <div className="max-w-md w-full space-y-8 ">
        <CardHeader>
   <CardTitle>Sign Up</CardTitle>   
    </CardHeader>
     <CardContent>
       

        {(error || formError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || formError}
          </div>
        )}

        <div className="space-y-6">
          <GoogleSignInButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2">Or sign up with email</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium ">
              Username
            </label>
            <Input
              id="username"
              type="text"
              required
              className="mt-1 block w-full p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium ">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              className="mt-1 block w-full p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium ">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4"
          >
            {loading ? <Spinner  size={25} /> : 'Sign Up'}
          </Button>
        </form> 
        </CardContent>
<CardFooter className='mt-3'>
        <CardDescription>
          Already have an account?{' '}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </CardDescription>
        </CardFooter>
       
      </div>
    </div>
  );
}





