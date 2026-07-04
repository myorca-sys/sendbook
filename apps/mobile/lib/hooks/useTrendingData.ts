import { useState, useEffect } from "react";
import { HF_API_URL } from "../config";
import { fetchWithAuth } from "../fetcher";
import { hasEps } from "../utils";
import { storage } from "../storage";

const CACHE_KEY = "trending_data_cache";

export function useTrendingData() {
  const [results, setResults] = useState<any[]>(() => {
    try {
      const cached = storage.getString(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.data)) {
          return parsed.data;
        }
      }
    } catch (e) {}
    return [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const cached = storage.getString(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          // Valid for 30 minutes (1,800,000 ms)
          if (
            parsed &&
            Date.now() - parsed.timestamp < 1800000 &&
            Array.isArray(parsed.data) &&
            parsed.data.length > 0
          ) {
            setResults(parsed.data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}

      setLoading(true);
      try {
        const url = `${HF_API_URL}/api/v1/browse?page=1&sort=trending&limit=30`;
        const res = await fetchWithAuth(url);

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON response, but got ${contentType}`);
        }

        const data = await res.json();
        if (data?.success && data.data) {
          const filtered = data.data.filter(hasEps);
          setResults(filtered);
          try {
            storage.set(
              CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                data: filtered,
              }),
            );
          } catch (e) {}
        } else {
          setResults([]);
        }
      } catch (e) {
        console.error("Trending fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return { results, loading };
}
