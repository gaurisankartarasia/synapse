// src/redux/features/jobProfileSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JobProfile } from '@/types/Job/JobProfile';

// Define the state type
interface JobState {
  profile: JobProfile | null;
  completionPercentage: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: JobState = {
  profile: null,
  completionPercentage: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
  'job/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user-profile/job/card');
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);



// Create the slice
const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    resetJobState: () => initialState,
  },
  extraReducers: (builder) => {
    // Handle fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<{ profile: JobProfile, completionPercentage: number }>) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.completionPercentage = action.payload.completionPercentage;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;