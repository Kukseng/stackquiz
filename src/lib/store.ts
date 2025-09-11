// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/authApi';
import { quizApi } from './api/quizApi';
import { categoryApi } from './api/categoryApi';
import { questionApi } from './api/questionApi';
import { optionApi } from './api/optionApi';
import { participantAnswerApi } from './api/participantAnswerApi';
import { participantApi } from './api/participantApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [optionApi.reducerPath]: optionApi.reducer,
    [participantAnswerApi.reducerPath]: participantAnswerApi.reducer,
    [participantApi.reducerPath]: participantApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      quizApi.middleware,
      categoryApi.middleware,
      questionApi.middleware,
      optionApi.middleware,
      participantAnswerApi.middleware,
      participantApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
