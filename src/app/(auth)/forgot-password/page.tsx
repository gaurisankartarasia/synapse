

'use client';

import { useState } from 'react';
import { auth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from '@/lib/firebaseClient';
import { Button, Card, CardHeader, CardContent, TextField, Box,  Alert, Typography, CardActions} from '@mui/material'
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
    <Box display="flex" justifyContent="center" alignItems="center" mt={6} mr={40} >
    <Card sx={{ maxWidth: 520, width: '100%', p:3  }}>
      <CardHeader title="Reset Password" />
  
      <CardContent>
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
  
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
  
        <form onSubmit={handleSubmit}>
          <TextField
            id="email"
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? 'Processing...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
  
      <CardActions sx={{ justifyContent: 'center' }}>
        <Typography variant="body2">
          Remembered your password?{' '}
          <Link href="/signin" passHref>
            <Typography
              component="span"
              sx={{ textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}
            >
              Sign in
            </Typography>
          </Link>
        </Typography>
      </CardActions>
    </Card>
  </Box>
  
  );
}
