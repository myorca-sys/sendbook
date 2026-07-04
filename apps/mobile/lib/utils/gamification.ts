import React from "react";
import { useUserProgress } from "../hooks/useUserProgress";
import { FEATURE_FLAGS } from "../config/features";

export function useGamificationStats(userId: string | undefined | null) {
  const { progressData } = useUserProgress(userId);

  const stats = React.useMemo(() => {
    const raw = Array.isArray(progressData) ? progressData : progressData?.data || [];

    const completedAnime = new Set<string>();
    raw.forEach((item: any) => {
      if (item.completed || item.isCompleted || item.is_completed) {
        const id = String(item.anilistId || item.anilist_id || "");
        if (id) completedAnime.add(id);
      }
    });
    const completedCount = completedAnime.size;
    const totalEps = raw.length;
    const daysWatched = ((totalEps * 24) / 60 / 24).toFixed(1);

    if (!FEATURE_FLAGS.ENABLE_GAMIFICATION) {
      return {
        completed: completedCount,
        totalEps: totalEps,
        days: daysWatched,
        level: 1,
        exp: 0,
        nextExp: 100,
      };
    }

    const exp = totalEps * 50;
    const level = Math.floor(Math.sqrt(exp / 50)) + 1;
    const nextExp = Math.pow(level, 2) * 50;

    return {
      completed: completedCount,
      totalEps: totalEps,
      days: daysWatched,
      level,
      exp,
      nextExp,
    };
  }, [progressData]);

  return stats;
}
