

// src/features/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile } from '@/services/profileAPI';

interface UserProfile {
  username: string;
  displayName: string;
  profilePhotoURL: string;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Specify that the thunk returns void and its argument is boolean (or undefined)
export const fetchProfile = createAsyncThunk<void, boolean | undefined>(
  'user/fetchProfile',
  async (forceFetch = false, { getState, dispatch }) => {
    const { user } = getState() as { user: UserState };

    if (!forceFetch && (user.profile || user.loading)) {
      return;
    }

    try {
      dispatch(setLoading(true));
      const data = await fetchUserProfile();
      dispatch(setProfile(data));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load profile'));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setProfile, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
