import { API_URL } from "../config";
import { fetchWithAuth } from "../fetcher";
import OrcaNativeCore from "../../modules/orca-native-core/src";
import { getMemoryToken } from "../auth";

export function executeSync(
  userId: string,
  anilistId: string,
  episode: string,
  currentT: number,
  durationT: number,
) {
  const isComp = durationT > 0 && currentT / durationT > 0.9;

  const sessionPayload = {
    session_id: `ses_${userId}_${anilistId}_${episode}_${Date.now()}`,
    user_id: userId,
    anilistId: parseInt(anilistId),
    episodeNumber: parseFloat(episode),
    watchDurationSec: Math.floor(currentT),
    totalDurationSec: Math.floor(durationT),
    qualityWatched: "Auto",
    providerUsed: "Cloudflare",
  };

  const progressPayload = {
    user_id: userId,
    anilistId: anilistId,
    episodeNumber: episode,
    progressSeconds: Math.floor(currentT),
    durationSeconds: Math.floor(durationT),
    isCompleted: isComp,
  };

  if (OrcaNativeCore && OrcaNativeCore.scheduleBackgroundRequest) {
    const token = getMemoryToken();
    OrcaNativeCore.scheduleBackgroundRequest(
      `${API_URL}/api/v2/social/watch-session`,
      JSON.stringify(sessionPayload),
      token,
    );
    OrcaNativeCore.scheduleBackgroundRequest(
      `${API_URL}/api/v2/social/progress`,
      JSON.stringify(progressPayload),
      token,
    );
  } else {
    fetchWithAuth(`${API_URL}/api/v2/social/watch-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionPayload),
    }).catch(() => {});

    fetchWithAuth(`${API_URL}/api/v2/social/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progressPayload),
    }).catch(() => {});
  }
}
