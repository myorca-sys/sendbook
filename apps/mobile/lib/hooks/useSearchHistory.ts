import { useState, useEffect, useCallback } from "react";
import { storage } from "../storage";

const STORAGE_KEY = "@search_history";
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);
  // No longer loading async, so we can start with false
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = storage.getString(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load search history", e);
    }
  };

  const saveHistory = (newHistory: string[]) => {
    const sliced = newHistory.slice(0, MAX_HISTORY);
    setHistory(sliced);
    try {
      storage.set(STORAGE_KEY, JSON.stringify(sliced));
    } catch (e) {
      console.error("Failed to save search history", e);
    }
  };

  const addSearchTerm = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const updated = [
        trimmed,
        ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase()),
      ];
      const sliced = updated.slice(0, MAX_HISTORY);
      try {
        storage.set(STORAGE_KEY, JSON.stringify(sliced));
      } catch (e) {
        console.error("Failed to save search history", e);
      }
      return sliced;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, []);

  return { history, isLoading, addSearchTerm, clearHistory };
}
