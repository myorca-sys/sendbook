import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { getMemoryToken, setMemoryToken } from "./auth";

const handleAuthError = async (res: Response) => {
  if (res.status === 401) {
    setMemoryToken(null);
    await SecureStore.deleteItemAsync("auth_session");
    try {
      router.replace("/profile" as any);
    } catch (e) {}
    throw new Error("Sesi telah berakhir, silakan login kembali.");
  }
};

const getHeaders = (opts: Record<string, string> = {}) => {
  const h: any = { "Content-Type": "application/json", ...opts };
  const t = getMemoryToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
};

export const fetcher = async (url: string) => {
  const res = await fetch(url, { headers: getHeaders() });
  await handleAuthError(res);
  const text = await res.text().catch(() => "Unavailable");
  if (text.includes("Preparing Space") || text.includes("Hugging Face"))
    throw new Error("COLD_START");

  if (res.headers.get("content-type")?.includes("text/html")) {
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      (err as any).info = text;
      throw err;
    }
    throw new Error("Unexpected HTML response from API");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse JSON response");
  }
  if (!res.ok) {
    const error = new Error(data?.message || data?.error || `HTTP ${res.status}`);
    (error as any).info = data;
    (error as any).status = res.status;
    throw error;
  }
  return data;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: getHeaders(options.headers as Record<string, string>),
  });
  await handleAuthError(res);
  return res;
};
