

// src/app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { signUpWithEmail } from '@/redux/features/authSlice';
import GoogleSignInButton from '../signin/GoogleSignInButton';
import { Button, Card, CardHeader, CardContent, TextField, Box, Divider, Alert, Typography, CardActions, CircularProgress, useMediaQuery, useTheme} from '@mui/material'

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

   const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')); 

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
    <Box display="flex" justifyContent="center" alignItems="center" mt={6}   mr={isDesktop ? 40 : 0} >
  <Card sx={{maxWidth: 520, width: '100%', p:3  }}>
    <CardHeader title="Sign Up" />

    <CardContent>
      {(error || formError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || formError}
        </Alert>
      )}

      <Box mb={4}>
        <GoogleSignInButton />
        <Box display="flex" alignItems="center" mt={3}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ mx: 2 }}>
            Or sign up with email
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          id="username"
          label="Username"
          fullWidth
          required
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <TextField
          id="password"
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>
      </form>
    </CardContent>

    <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
      <Typography variant="body2">
        Already have an account?{' '}
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





