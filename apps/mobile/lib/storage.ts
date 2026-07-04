import { createMMKV } from "react-native-mmkv";

// Singleton instance for global app storage
export const storage = createMMKV({
  id: "orca-app-storage",
});

// Adapter for TanStack Query Persist Client
export const clientStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.remove(key);
  },
};
