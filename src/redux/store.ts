

// // src/redux/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './features/authSlice';
// import userReducer from './features/userSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     user: userReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types
//         ignoredActions: ['auth/setUser'],
//         // Ignore these field paths in all actions
//         ignoredActionPaths: ['payload'],
//         // Ignore these paths in the state
//         ignoredPaths: [],
//       },
//     }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;




// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;