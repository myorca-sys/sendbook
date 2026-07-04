import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export function useVideoFallback(
  initialVideoUrl: string | null,
  sources: any[] = [],
) {
  const [activeUrl, setActiveUrl] = useState(initialVideoUrl);
  const [activeQuality, setActiveQuality] = useState<string | null>(null);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);

  const stuckSecondsRef = useRef(0);
  const lastProgressTimeRef = useRef(Date.now());
  const previousUrlRef = useRef(activeUrl);

  useEffect(() => {
    if (initialVideoUrl) {
      console.log(
        `[VideoFallback] Attempting to play: ${initialVideoUrl.substring(0, 100)}...`,
      );
      setActiveUrl(initialVideoUrl);
      setActiveQuality(null); // Reset quality selection on new video
      setSourceIndex(0);
      setIsBuffering(true);
    } else {
      setActiveUrl(null);
      setActiveQuality(null);
    }
  }, [initialVideoUrl]);

  const availableQualities = useMemo(() => {
    if (!sources || sources.length === 0) return [];
    const sortOrder: Record<string, number> = {
      "4k": 6,
      "10bit": 5,
      "1080p": 4,
      "720p": 3,
      "480p": 2,
      "360p": 1,
      Auto: 0,
    };
    return Array.from(new Set(sources.map((s) => s.quality))).sort(
      (a, b) => (sortOrder[b] || 0) - (sortOrder[a] || 0),
    );
  }, [sources]);

  useEffect(() => {
    if (sources.length > 0 && !activeQuality && !activeUrl) {
      // Optimasi: Prioritaskan '720p' agar loading 0ms di mobile. 1080p terlalu berat untuk default awal.
      const defaultQ =
        availableQualities.find((q) => q === "720p") ||
        availableQualities.find((q) => q === "Auto") ||
        availableQualities.find((q) =>
          ["480p", "360p", "1080p"].includes(q),
        ) ||
        availableQualities[0];
      setActiveQuality(defaultQ);
      setSourceIndex(0);
      const qSources = sources.filter((s) => s.quality === defaultQ);
      const directSource = qSources.find((s) => s.type.includes("direct"));
      if (directSource) setActiveUrl(directSource.url);
      else if (qSources.length > 0) setActiveUrl(qSources[0].url);
    }
  }, [sources, activeQuality, activeUrl, availableQualities]);

  const handleProgressReceived = useCallback(() => {
    lastProgressTimeRef.current = Date.now();
    stuckSecondsRef.current = 0;
    setIsBuffering(false);
  }, []);

  const handleWatchdogTick = useCallback(
    (isPlaying: boolean) => {
      if (!isPlaying) {
        setIsBuffering(false);
        lastProgressTimeRef.current = Date.now();
        return;
      }

      const timeSinceLastProgress = Date.now() - lastProgressTimeRef.current;
      if (timeSinceLastProgress > 5000) {
        setIsBuffering(true);
        stuckSecondsRef.current += 1;
        if (stuckSecondsRef.current >= 30 && activeQuality) {
          const deadUrl = activeUrl;
          const qSources = sources.filter((s) => s.quality === activeQuality);
          if (sourceIndex + 1 < qSources.length) {
            stuckSecondsRef.current = 0;
            setSourceIndex((prev) => prev + 1);
            setActiveUrl(qSources[sourceIndex + 1].url);
            if (deadUrl)
              fetch(
                `${process.env.EXPO_PUBLIC_API_URL || "https://orcanime-api-edge.moehamadhkl.workers.dev"}/api/v2/telemetry/dead-link`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ video_url: deadUrl }),
                },
              ).catch(() => {});
          }
        }
      } else stuckSecondsRef.current = 0;
    },
    [activeQuality, sourceIndex, sources, activeUrl],
  );

  const changeQuality = (quality: string) => {
    const qSources = sources.filter((s) => s.quality === quality);
    if (qSources.length > 0) {
      setActiveQuality(quality);
      setSourceIndex(0);
      const bestSource =
        qSources.find((s) => s.type && s.type.includes("direct")) ||
        qSources[0];
      setActiveUrl(bestSource.url);
    }
  };

  return {
    activeUrl,
    activeQuality,
    availableQualities,
    isBuffering,
    setIsBuffering,
    previousUrlRef,
    handleProgressReceived,
    handleWatchdogTick,
    changeQuality,
  };
}
