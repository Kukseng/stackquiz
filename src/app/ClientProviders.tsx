"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { store } from "@/store/store";
import LayoutWrapper from "./LayoutWrapper";

/**
 * Client-side Providers Component
 * Wraps all client-side providers and the LayoutWrapper
 * This keeps all client-side logic separate from the server layout
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </SessionProvider>
    </Provider>
  );
}
