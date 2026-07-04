import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import { checkSession, verifyWithBackend } from "./utils/authHelpers";

// Memory cache for tokens to prevent SecureStore I/O bottlenecks during fetch calls
let inMemoryToken: string | null = null;
export const getMemoryToken = () => inMemoryToken;
export const setMemoryToken = (token: string | null) => {
  inMemoryToken = token;
};

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
        "475749423464-e2dq5kmtgdehbbb369f0nvr86f73gpl0.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    // Check session once on app load
    checkSession(setUser, setIsLoading).then((sessionData) => {
      if (sessionData) {
        const token =
          sessionData?.token ||
          sessionData?.session?.token ||
          sessionData?.accessToken ||
          sessionData?.user?.token;
        setMemoryToken(token || null);
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      if (userInfo?.data?.idToken) {
        await verifyWithBackend(
          userInfo.data.idToken,
          tokens.accessToken,
          setUser,
          setIsLoading,
          setMemoryToken,
        );
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setMemoryToken(null);
      await SecureStore.deleteItemAsync("auth_session");
      await GoogleSignin.signOut();
    } catch (error) {}
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
