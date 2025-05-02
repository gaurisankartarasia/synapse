
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { db } from '@/lib/firebaseClient';
// import { collection, getDocs, addDoc, doc, getDoc, DocumentData } from 'firebase/firestore';

// export interface Job {
//   id?: string;
//   title: string;
//   description: string;
//   company: string;
//   location: string;
//   salary: string;
//   jobType: string;
//   requirements: string[];
//   postedDate: string;
//   deadline?: string;
//   creatorId: string;
// }

// interface JobState {
//   jobs: Job[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: JobState = {
//   jobs: [],
//   loading: false,
//   error: null,
// };

// // Improved type-safe serialization helper
// const ensureSerializable = (obj: DocumentData): Job => {
//   return {
//     ...obj,
//     requirements: Array.isArray(obj.requirements) 
//       ? obj.requirements 
//       : [obj.requirements].filter(Boolean),
//     postedDate: obj.postedDate 
//       ? (obj.postedDate.toDate ? obj.postedDate.toDate().toISOString() : obj.postedDate)
//       : new Date().toISOString()
//   } as Job;
// };

// export const fetchJobs = createAsyncThunk<Job[], void>(
//   'job/fetchJobs',
//   async (_, { rejectWithValue }) => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'jobs'));
//       const jobs: Job[] = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...ensureSerializable(doc.data())
//       }));
      
//       return jobs;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to fetch jobs');
//     }
//   }
// );

// export const createJob = createAsyncThunk<Job, Omit<Job, 'id'>>(
//   'job/createJob',
//   async (jobData, { rejectWithValue }) => {
//     try {
//       const docRef = await addDoc(collection(db, 'jobs'), jobData);
//       const docSnap = await getDoc(doc(db, 'jobs', docRef.id));
      
//       if (docSnap.exists()) {
//         return {
//           id: docSnap.id,
//           ...ensureSerializable(docSnap.data())
//         };
//       }
//       throw new Error('Failed to retrieve created job document');
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to create job');
//     }
//   }
// );

// const jobSlice = createSlice({
//   name: 'job',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchJobs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchJobs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs = action.payload;
//       })
//       .addCase(fetchJobs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch jobs';
//       })
//       .addCase(createJob.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createJob.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs.push(action.payload);
//       })
//       .addCase(createJob.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to create job';
//       });
//   },
// });

// export default jobSlice.reducer;




// src/store/slices/jobSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '@/types/Job/job';


interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
};

// Remove the client-side ensureSerializable helper, server handles serialization now

// --- Refactored fetchJobs Thunk ---
export const fetchJobs = createAsyncThunk<Job[], void>(
  'job/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/jobs'); // Call the GET endpoint

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error details
        throw new Error(errorData.error || `Failed to fetch jobs: ${response.statusText}`);
      }

      const data = await response.json();
      // Ensure the data structure matches expectations (e.g., { jobs: [...] })
      if (!data || !Array.isArray(data.jobs)) {
          throw new Error('Invalid data format received from API');
      }
      return data.jobs as Job[]; // Return the jobs array

    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred while fetching jobs');
    }
  }
);

// --- Refactored createJob Thunk ---
// Input type now excludes 'id' as it's generated on the server
export const createJob = createAsyncThunk<Job, Omit<Job, 'id'>>(
  'job/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/jobs', { // Call the POST endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData), // Send job data in the body
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({})); // Try to parse error details
         // Use specific message if available, otherwise generic
         throw new Error(errorData.error || `Failed to create job: ${response.statusText}`);
      }

      const createdJob = await response.json();
       // Optionally validate the structure of createdJob here
      return createdJob as Job; // Return the created job (should include the ID)

    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred while creating the job');
    }
  }
);

// --- Slice Definition (No changes needed here) ---
const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
      // Add any synchronous reducers if needed
      // e.g., clearJobs: (state) => { state.jobs = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        // Use payload for rejectWithValue message, fallback to error.message
        state.error = action.payload as string || action.error.message || 'Failed to fetch jobs';
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        // Add the newly created job to the list
        // Consider sorting or prepending based on your UI needs
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
         // Use payload for rejectWithValue message, fallback to error.message
        state.error = action.payload as string || action.error.message || 'Failed to create job';
      });
  },
});

// Export any synchronous actions if you added them
// export const { clearJobs } = jobSlice.actions;

export default jobSlice.reducer;