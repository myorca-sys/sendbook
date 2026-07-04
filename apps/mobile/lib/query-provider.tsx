import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import * as SplashScreen from "expo-splash-screen";
import { AppState, AppStateStatus } from "react-native";
import { clientStorage } from "./storage";

// 1. Create a QueryClient instance and export it for use outside React tree
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

// 2. Create the persister using MMKV
const syncStoragePersister = createSyncStoragePersister({
  storage: clientStorage,
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Optional: Hide splash screen after ensuring basic hydration has started
    SplashScreen.hideAsync().catch(() => {});
    setIsHydrated(true);

    // Setup Refetch on App Focus
    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => {
        if (status === "active") {
          // App has come to foreground
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: syncStoragePersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
