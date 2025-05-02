
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import followReducer from './features/followSlice';
import postReducer from './features/postSlice';
import suggestionsReducer from './features/suggestionSlice';
import geminiReducer from './features/gemini/geminiSlice';
import jobReducer from './features/jobSlice';
import cartReducer from "./features/cartSlice";
import jobProfileReducer from "./features/jobProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    user: userReducer,
    follow: followReducer,
    post: postReducer,
    suggestions: suggestionsReducer,
    gemini: geminiReducer,
    job: jobReducer,
    jobProfile: jobProfileReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser', 'jwtAuth/initializeAuth'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['jwtAuth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;