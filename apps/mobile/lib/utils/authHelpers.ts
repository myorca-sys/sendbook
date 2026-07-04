import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config";

export async function checkSession(
  setUser: (user: any) => void,
  setIsLoading: (loading: boolean) => void,
) {
  try {
    const sessionStr = await SecureStore.getItemAsync("auth_session");
    if (sessionStr) {
      const sessionData = JSON.parse(sessionStr);
      if (sessionData?.user) setUser(sessionData.user);
      return sessionData;
    }
  } catch (e) {
    console.error("Session check error", e);
  } finally {
    setIsLoading(false);
  }
  return null;
}

export async function verifyWithBackend(
  idToken: string,
  accessToken: string | undefined,
  setUser: (user: any) => void,
  setIsLoading: (loading: boolean) => void,
  setMemoryToken: (token: string | null) => void,
) {
  setIsLoading(true);
  try {
    const res = await fetch(`${API_URL}/api/auth/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: API_URL,
      },
      body: JSON.stringify({
        provider: "google",
        idToken: { token: idToken, accessToken: accessToken || "" },
        disableRedirect: true,
      }),
      redirect: "manual",
    });

    if (
      res.type === "opaqueredirect" ||
      (res.status >= 300 && res.status < 400)
    ) {
      setIsLoading(false);
      return;
    }

    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        await SecureStore.setItemAsync("auth_session", JSON.stringify(data));
        if (data.user) setUser(data.user);

        const token =
          data?.token ||
          data?.session?.token ||
          data?.accessToken ||
          data?.user?.token;
        setMemoryToken(token || null);
      }
    }
  } catch (e) {
    console.error("Auth Exception:", e);
  } finally {
    setIsLoading(false);
  }
}
