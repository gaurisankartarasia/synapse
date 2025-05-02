

'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithGoogle } from '@/redux/features/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import Image from 'next/image';
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';

export default function GoogleSignInButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

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

  const handleGoogleSignIn = async () => {
    try {
      const resultAction = await dispatch(signInWithGoogle());

      if (signInWithGoogle.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: 'Sign in successful',
          severity: 'success',
        });
        router.push('/');
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to sign in with Google',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Google sign in failed:', err);
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
        disableRipple
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant='outlined'
          fullWidth
          startIcon={
            !loading && (
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2FgoogleIcon.png?alt=media&token=627be043-9734-4414-986f-1a6c1bf25698"
                height={18}
                width={18}
                alt="google"
              />
            )
          }
          sx={{
            textTransform: 'none',
            justifyContent: 'center',
            fontWeight: 500,
          }}
        >
          {loading ? (
            <CircularProgress size={22} />
          ) : (
            'Continue with Google'
          )}
        </Button>
      </Box>

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
    </>
  );
}
