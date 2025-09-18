"use client"

import { Suspense } from "react"
import LayoutWrapper from "./LayoutWrapper"
import { LanguageProvider } from "../context/LanguageContext"
import { Provider } from "react-redux"
import { store } from "../lib/store"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <LanguageProvider>
          <Suspense fallback={null}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Suspense>
        </LanguageProvider>
      </SessionProvider>
    </Provider>
  )
}
