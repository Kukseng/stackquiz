// lib/store.ts (or store/store.ts)
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { quizApi } from '../lib/api/quizApi'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [quizApi.reducerPath]: quizApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(quizApi.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// For Next.js 15 with app directory
export const store = makeStore()
setupListeners(store.dispatch)