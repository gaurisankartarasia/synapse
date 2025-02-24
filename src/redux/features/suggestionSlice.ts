//src/redux/features/suggestionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface SuggestionsState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: SuggestionsState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk for fetching suggested users
export const fetchSuggestedUsers = createAsyncThunk(
  'suggestions/fetchSuggestedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/suggested');
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Something went wrong');
    }
  }
);

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    resetSuggestions: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { resetSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;

