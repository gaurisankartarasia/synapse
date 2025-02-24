// src/types/user.ts


// src/features/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { UserProfile } from '@/types/user';
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