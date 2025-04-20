
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { signInWithEmail } from '@/redux/features/authSlice';

import GoogleSignInButton from './GoogleSignInButton';

import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(signInWithEmail({ email, password }));
      if (signInWithEmail.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: 'Sign in successful',
          severity: 'success',
        });
        router.replace('/');
      } else {
        setSnackbar({
          open: true,
          message: 'Incorrect email or password',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      component="section"
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={6}
      mr={40}
    >
      <Card sx={{ maxWidth: 520, width: '100%', p:3 }}>
        <CardHeader title="Sign In" />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box mb={4}>
            <GoogleSignInButton />
            <Typography variant="body2" align="center" mt={4} mb={2}>
              Or continue with
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Box mt={2} textAlign="right">
            <Link href="/forgot-password" passHref>
              <Typography variant="body2" component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Link>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" passHref>
              <Typography
                component="span"
                sx={{ textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}
              >
                Sign up
              </Typography>
            </Link>
          </Typography>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

