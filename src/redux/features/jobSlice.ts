





// // src/redux/features/jobSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { db } from '@/lib/firebaseClient'; // Client-side Firebase
// import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';

// interface Job {
//   id?: string;
//   title: string;
//   description: string;
//   company: string;
//   location: string;
//   salary: string;
//   jobType: string;
//   requirements: string | string[];
//   postedDate: string; // Make sure this is a string, not a Date object
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

// // Helper function to ensure dates are strings
// const ensureSerializable = (obj: any): any => {
//   const result = { ...obj };
  
//   // Convert any Firestore Timestamps or Date objects to ISO strings
//   Object.keys(result).forEach(key => {
//     const value = result[key];
    
//     // Check if it's a Firestore Timestamp
//     if (value && typeof value.toDate === 'function') {
//       result[key] = value.toDate().toISOString();
//     }
//     // Check if it's a Date object
//     else if (value instanceof Date) {
//       result[key] = value.toISOString();
//     }
//     // Handle nested objects recursively
//     else if (value && typeof value === 'object' && !Array.isArray(value)) {
//       result[key] = ensureSerializable(value);
//     }
//   });
  
//   return result;
// };

// export const fetchJobs = createAsyncThunk<Job[], void>(
//   'job/fetchJobs',
//   async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'jobs'));
//       const jobs: Job[] = [];
      
//       querySnapshot.forEach((doc) => {
//         // Process each document to ensure date fields are serializable
//         const jobData = ensureSerializable(doc.data());
//         jobs.push({ id: doc.id, ...jobData } as Job);
//       });
      
//       return jobs;
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }
// );

// export const createJob = createAsyncThunk<Job, Job>(
//   'job/createJob',
//   async (jobData: Job) => {
//     try {
//       // Ensure dates are properly formatted for Firestore
//       // If you're sending dates as strings from the UI, this conversion may not be needed
//       const docRef = await addDoc(collection(db, 'jobs'), jobData);
//       const docSnap = await getDoc(doc(db, 'jobs', docRef.id));
      
//       if (docSnap.exists()) {
//         // Ensure dates are strings when adding to Redux store
//         const data = ensureSerializable(docSnap.data());
//         return { id: docSnap.id, ...data } as Job;
//       }
//       throw new Error('Failed to retrieve created job document');
//     } catch (error: any) {
//       throw new Error(error.message);
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











import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc, doc, getDoc, DocumentData } from 'firebase/firestore';

export interface Job {
  id?: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  requirements: string[];
  postedDate: string;
  deadline?: string;
  creatorId: string;
}

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

// Improved type-safe serialization helper
const ensureSerializable = (obj: DocumentData): Job => {
  return {
    ...obj,
    requirements: Array.isArray(obj.requirements) 
      ? obj.requirements 
      : [obj.requirements].filter(Boolean),
    postedDate: obj.postedDate 
      ? (obj.postedDate.toDate ? obj.postedDate.toDate().toISOString() : obj.postedDate)
      : new Date().toISOString()
  } as Job;
};

export const fetchJobs = createAsyncThunk<Job[], void>(
  'job/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobs: Job[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...ensureSerializable(doc.data())
      }));
      
      return jobs;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk<Job, Omit<Job, 'id'>>(
  'job/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), jobData);
      const docSnap = await getDoc(doc(db, 'jobs', docRef.id));
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...ensureSerializable(docSnap.data())
        };
      }
      throw new Error('Failed to retrieve created job document');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create job');
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create job';
      });
  },
});

export default jobSlice.reducer;