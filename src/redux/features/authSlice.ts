
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import { auth, googleProvider, db } from '@/lib/firebaseClient';
// import { getDoc, doc } from 'firebase/firestore';
// import { signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';

// // Define a serializable user interface
// interface SerializableUser {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   profilePhotoURL: string | null;
//   emailVerified: boolean;
// }

// interface AuthState {
//   user: SerializableUser | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// // Helper function to convert Firebase user to serializable object
// const serializeUser = (firebaseUser: User | null): SerializableUser | null => {
//   if (!firebaseUser) return null;

//   return {
//     uid: firebaseUser.uid,
//     email: firebaseUser.email,
//     displayName: firebaseUser.displayName,
//     profilePhotoURL: firebaseUser.photoURL,
//     emailVerified: firebaseUser.emailVerified,
//   };
// };

// export const signUpWithEmail = createAsyncThunk(
//   'auth/signUpWithEmail',
//   async (
//     { email, password, username }: { email: string; password: string; username: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await fetch('/api/v1/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, username }),
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Signup failed');
//       }

//       const data = await response.json();
//       return {
//         user: data.user,
//         hasUsername: false
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for email/password sign in
// export const signInWithEmail = createAsyncThunk(
//   'auth/signInWithEmail',
//   async (
//     { email, password }: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);

//       const response = await fetch('/api/v1/auth/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         throw new Error('Authentication failed');
//       }

//       // Check username after successful sign in
//       const userDoc = await getDoc(doc(db, 'users', result.user.uid));
//       const hasUsername = userDoc.exists() && userDoc.data().username;

//       return {
//         user: serializeUser(result.user),
//         hasUsername,
//       };
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );


// // In signInWithGoogle thunk
// export const signInWithGoogle = createAsyncThunk(
//   'auth/signInWithGoogle',
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const idToken = await result.user.getIdToken();

//       const response = await fetch('/api/v1/auth/google', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           idToken,
//           userInfo: {
//             email: result.user.email,
//             displayName: result.user.displayName,
//             profilePhotoURL: result.user.photoURL,
//           },
//         }),
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Google authentication failed');
//       }

//       const data = await response.json();
      
//       // Check username after successful sign in
//       const userDoc = await getDoc(doc(db, 'users', result.user.uid));
//       const hasUsername = userDoc.exists() && userDoc.data()?.username;

//       return {
//         user: serializeUser(result.user),
//         hasUsername,
//       };
//     } catch (error: any) {
//       console.error('Google sign-in error:', error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Async thunk for sign out
// export const signOutUser = createAsyncThunk(
//   'auth/signOut',
//   async (_, { rejectWithValue }) => {
//     try {
//       await signOut(auth);
//       await fetch('/api/v1/auth/signout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<SerializableUser | null>) => {
//       state.user = action.payload;
//       state.loading = false;
//       state.error = null;
//     },

//     clearError: (state) => {
//       state.error = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//     .addCase(signUpWithEmail.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     })
//     .addCase(signUpWithEmail.fulfilled, (state, action) => {
//       state.loading = false;
//       state.user = action.payload.user;
//       state.error = null;
//     })
//     .addCase(signUpWithEmail.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     })

//       // Sign in with email
//       .addCase(signInWithEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signInWithEmail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user; // Extract and assign only the user
//         state.error = null;
//       })
//       .addCase(signInWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Sign in with Google
//       .addCase(signInWithGoogle.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signInWithGoogle.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user; // Extract and assign only the user
//         state.error = null;
//       })
//       .addCase(signInWithGoogle.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Sign out
//       .addCase(signOutUser.fulfilled, (state) => {
//         state.user = null;
//         state.loading = false;
//         state.error = null;
//       });
//   },
// });

// export const { setUser, clearError } = authSlice.actions;
// export default authSlice.reducer;




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { auth, googleProvider, db } from '@/lib/firebaseClient';
import { getDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup,  signOut, User } from 'firebase/auth';

// Define a serializable user interface
interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  profilePhotoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Helper function to convert Firebase user to serializable object
const serializeUser = (firebaseUser: User | null): SerializableUser | null => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    profilePhotoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
  };
};

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (
    { email, password, username }: { email: string; password: string; username: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      return {
        user: data.user,
        hasUsername: false
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for email/password sign in
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const response = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      // Check username after successful sign in
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const hasUsername = userDoc.exists() && userDoc.data().username;

      return {
        user: serializeUser(result.user),
        hasUsername,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// In signInWithGoogle thunk
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          userInfo: {
            email: result.user.email,
            displayName: result.user.displayName,
            profilePhotoURL: result.user.photoURL,
          },
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Google authentication failed');
      }

      const data = await response.json();
      
      // Check username after successful sign in
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const hasUsername = userDoc.exists() && userDoc.data()?.username;

      return {
        user: serializeUser(result.user),
        hasUsername,
      };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for sign out
export const signOutUser = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      await fetch('/api/v1/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
    .addCase(signUpWithEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signUpWithEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
    })
    .addCase(signUpWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

      // Sign in with email
      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Extract and assign only the user
        state.error = null;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Extract and assign only the user
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign out
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;


