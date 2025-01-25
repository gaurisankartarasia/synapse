// src/redux/features/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserState {
  username: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  username: null,
  loading: false,
  error: null,
};


export const checkUsername = createAsyncThunk(
  'user/checkUsername',
  async (uid: string, { rejectWithValue }) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists() && userDoc.data().username) {
        return userDoc.data().username;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setUsername = createAsyncThunk(
  'user/setUsername',
  async ({ uid, username }: { uid: string; username: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/username/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Username already taken');
      }

      await setDoc(doc(db, 'users', uid), { username }, { merge: true });
      return username;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload;
      })
      .addCase(checkUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload;
      })
      .addCase(setUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
