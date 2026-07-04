import { useEffect } from "react";
import { useSwarmScraper } from "../../../lib/hooks/useSwarmScraper";

export function useHomeSwarm(mediaType: "anime" | "manga") {
  const {
    data: samehadakuData,
    loading: sLoading,
    fetchWithSwarmFallback: fetchSamehadaku,
    needSwarmResolution: sNeedSwarm,
    swarmTargetUrl: sTargetUrl,
    handleSwarmSuccess: sSuccess,
    handleSwarmError: sError,
  } = useSwarmScraper("samehadaku", "latest_episodes");

  const {
    data: kuronimeData,
    loading: kLoading,
    fetchWithSwarmFallback: fetchKuronime,
    needSwarmResolution: kNeedSwarm,
    swarmTargetUrl: kTargetUrl,
    handleSwarmSuccess: kSuccess,
    handleSwarmError: kError,
  } = useSwarmScraper("kuronime", "latest_episodes");

  useEffect(() => {
    if (mediaType === "anime") {
      fetchSamehadaku();
      fetchKuronime();
    }
  }, [mediaType]);

  return {
    samehadakuData,
    sLoading,
    sNeedSwarm,
    sTargetUrl,
    sSuccess,
    sError,
    kuronimeData,
    kLoading,
    kNeedSwarm,
    kTargetUrl,
    kSuccess,
    kError,
  };
}
