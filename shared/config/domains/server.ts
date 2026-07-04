const getEnv = (key: string, fallback: string): string => {
  if (typeof process !== "undefined" && process.env) {
    return (process.env[key] as string) || fallback;
  }
  return fallback;
};

export const API_URL = getEnv(
  "EXPO_PUBLIC_API_URL",
  "https://api.sendbook.workers.dev",
);

export const WEB_URL = getEnv(
  "EXPO_PUBLIC_WEB_URL",
  "https://sendbook.pages.dev",
);
