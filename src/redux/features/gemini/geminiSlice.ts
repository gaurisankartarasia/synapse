// src/redux/gemini/geminiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface GeminiState {
  generatedText: string;
  loading: boolean;
  error: string | null;
}

const initialState: GeminiState = {
  generatedText: '',
  loading: false,
  error: null,
};

export const generateTextAsync = createAsyncThunk(
  'gemini/generateText',
  async ({ prompt, model }: { prompt: string; model?: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/api/v1/gemini/gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to generate text.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const decodedChunk = decoder.decode(value);
          accumulatedText += decodedChunk; // Append the new chunk!
          dispatch(updateGeneratedText(accumulatedText));
        }
      }
      // return accumulatedText;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error.');
    }
  }
);

const geminiSlice = createSlice({
  name: 'gemini',
  initialState,
  reducers: {
    updateGeneratedText: (state, action: PayloadAction<string>) => {
      state.generatedText = action.payload;
    },
    clearGeneratedText: (state) => {
      state.generatedText = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTextAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.generatedText = ""; // Clear previous text.
      })
      .addCase(generateTextAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateTextAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateGeneratedText, clearGeneratedText } = geminiSlice.actions;
export default geminiSlice.reducer;