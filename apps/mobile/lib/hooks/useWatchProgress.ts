import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../config";
import { fetcher } from "../fetcher";
import { executeSync } from "../utils/syncHelpers";

export function useWatchProgress(
  userId: string | undefined,
  anilistId: string,
  episode: string,
  videoUrl: string | null,
) {
  const currentVideoTime = useRef(0);
  const currentVideoDuration = useRef(0);
  const lastSyncTimeSecRef = useRef(-1);
  const lastSyncRealTimeRef = useRef(0);

  const { data: watchSessionData } = useQuery({
    queryKey: ["watchSession", anilistId, episode, userId],
    queryFn: () =>
      fetcher(`${API_URL}/api/v2/social/watch-session/${anilistId}/${episode}?user_id=${userId}`),
    enabled: !!userId,
  });

  const saveProgressRef = useRef<(isForced?: boolean, isUnmounting?: boolean) => void>(undefined as any);

  useEffect(() => {
    if (!userId || !videoUrl) return;

    saveProgressRef.current = (isForced = false, isUnmounting = false) => {
      try {
        const currentT = currentVideoTime.current;
        const durationT = currentVideoDuration.current;

        if (currentT <= 1) return;

        const timeSinceLastSyncReal = Date.now() - lastSyncRealTimeRef.current;
        const timeSinceLastSyncVideo = Math.abs(currentT - lastSyncTimeSecRef.current);

        if (!isUnmounting) {
          if (!isForced) {
            // Periodic sync: only sync once every 60 seconds
            if (timeSinceLastSyncReal < 60000 && timeSinceLastSyncVideo < 60) {
              return;
            }
          } else {
            // Forced sync (pause, seek, background): throttle to once every 5 seconds
            // unless the video position changed significantly (e.g. seeking to a new place)
            if (timeSinceLastSyncReal < 5000 && timeSinceLastSyncVideo < 5) {
              return;
            }
          }
        }

        lastSyncTimeSecRef.current = currentT;
        lastSyncRealTimeRef.current = Date.now();

        executeSync(userId, anilistId, episode, currentT, durationT);
      } catch (e) {}
    };

    // Run periodic sync check every 10 seconds (it will check the 60-second rule inside)
    const intervalSync = setInterval(() => {
      if (saveProgressRef.current) saveProgressRef.current(false);
    }, 10000);

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/)) {
        if (saveProgressRef.current) saveProgressRef.current(true);
      }
    });

    return () => {
      clearInterval(intervalSync);
      subscription.remove();
      if (saveProgressRef.current) saveProgressRef.current(true, true);
    };
  }, [userId, anilistId, episode, videoUrl]);

  const updateProgress = useCallback((time: number, duration: number) => {
    currentVideoTime.current = time;
    currentVideoDuration.current = duration;
  }, []);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const forceSync = useCallback(() => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      if (saveProgressRef.current) saveProgressRef.current(true);
    }, 1000);
  }, []);

  return { updateProgress, forceSync, watchSessionData };
}
