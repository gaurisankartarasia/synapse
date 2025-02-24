// src/hooks/useProfile.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setProfile, setLoading, setError } from '@/redux/features/userSlice';
import { fetchUserProfile } from '@/services/api';

export function useProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state: RootState) => state.user);

  const loadProfile = async () => {
    try {
      dispatch(setLoading(true));
      const data = await fetchUserProfile();
      dispatch(setProfile(data));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load profile'));
    }
  };

  useEffect(() => {
    if (!profile) {
      loadProfile();
    }
  }, []);

  return { profile, loading, error, refetch: loadProfile };
}