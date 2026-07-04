import React from "react";
import { SwarmResolver } from "../../swarm/SwarmResolver";

export function HomeSwarmResolvers({
  sNeedSwarm,
  sTargetUrl,
  sSuccess,
  sError,
  kNeedSwarm,
  kTargetUrl,
  kSuccess,
  kError,
}: any) {
  return (
    <>
      {sNeedSwarm && sTargetUrl && (
        <SwarmResolver
          url={sTargetUrl}
          provider="samehadaku"
          endpoint="latest_episodes"
          onSuccess={sSuccess}
          onError={sError}
        />
      )}
      {kNeedSwarm && kTargetUrl && (
        <SwarmResolver
          url={kTargetUrl}
          provider="kuronime"
          endpoint="latest_episodes"
          onSuccess={kSuccess}
          onError={kError}
        />
      )}
    </>
  );
}
