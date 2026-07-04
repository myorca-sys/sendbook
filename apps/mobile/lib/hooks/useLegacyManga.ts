import { useState, useCallback, useEffect } from "react";
import {
  normalizeMediaDetail,
  UnifiedMediaDetail,
} from "../adapters/mediaAdapter";
import { MangaEngine } from "../manga/engine";
import { getMangaSourceById } from "../manga/sources";

export function useLegacyManga(id: string, isLegacyManga: boolean) {
  const [legacyData, setLegacyData] = useState<UnifiedMediaDetail | null>(null);
  const [legacyLoading, setLegacyLoading] = useState(false);
  const [legacyError, setLegacyError] = useState<any>(null);

  const fetchLegacyManga = useCallback(async () => {
    if (!isLegacyManga || !id) return;
    setLegacyLoading(true);
    setLegacyError(null);
    try {
      const [sourceId, encodedUrl] = id.split("|");
      const sourceRule = await getMangaSourceById(sourceId);
      if (sourceRule) {
        const raw = await MangaEngine.getDetail(
          sourceRule,
          decodeURIComponent(encodedUrl),
        );
        setLegacyData(normalizeMediaDetail(raw));
      } else throw new Error("Manga source not supported.");
    } catch (e) {
      setLegacyError(e);
    } finally {
      setLegacyLoading(false);
    }
  }, [id, isLegacyManga]);

  useEffect(() => {
    if (isLegacyManga) fetchLegacyManga();
  }, [fetchLegacyManga, isLegacyManga]);

  return { legacyData, legacyLoading, legacyError, fetchLegacyManga };
}
