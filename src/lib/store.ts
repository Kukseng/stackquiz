// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/authApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(authApi.middleware);
    console.log('Middleware applied:', middleware);
    return middleware;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;