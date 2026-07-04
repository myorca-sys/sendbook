import { useQuery } from "@tanstack/react-query";
import { dreas } from "./dreas_pb";

const MIN_CORE_VERSION = "2.0.0"; // Current version of the native core

async function dreasFetcher(url: string): Promise<dreas.DREASManifest | null> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/x-protobuf",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch DREAS rules: ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/x-protobuf")) {
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const message = dreas.DREASManifest.decode(uint8Array);
    return message;
  }

  // Fallback if edge didn't send protobuf
  const json = await response.json();
  if (json.success && json.data) {
    return dreas.DREASManifest.fromObject(json.data);
  }

  throw new Error("Invalid response format");
}

export function useDreasRules(providerId: string) {
  const edgeApiUrl =
    process.env.EXPO_PUBLIC_EDGE_URL || "https://orcanime-api-edge.moehamadhkl.workers.dev";

  const { data, isLoading, error } = useQuery({
    queryKey: ["dreas_rules", providerId],
    queryFn: () => dreasFetcher(`${edgeApiUrl}/api/v2/dreas/rules/${providerId}`),
    staleTime: 1000 * 60 * 60 * 24, // 1 day stale time, relies on SWR locally
  });

  const manifest = data;
  const isCompatible = manifest ? manifest.minCoreVersion <= MIN_CORE_VERSION : false;

  return {
    manifest: isCompatible ? manifest : null,
    isLoading,
    error: isCompatible
      ? error
      : manifest
        ? new Error(`Incompatible core version: requires ${manifest.minCoreVersion}`)
        : error,
    isCompatible,
  };
}

export async function executeDreasRule(
  manifest: dreas.DREASManifest,
  url: string,
  ruleName: string,
) {
  if (!manifest || !manifest.rules) return null;
  const rule = manifest.rules[ruleName];
  if (!rule) return null;

  // Here we would bridge to the OrcaNativeCore module
  // const html = await OrcaNativeCore.fetchHtml(url, manifest.execution_config);
  // const parsed = OrcaNativeCore.parseDom(html, rule);
  // return parsed;

  console.warn("OrcaNativeCore bridging not yet implemented, returning mock");
  return null;
}

/**
 * JS-Based fallback executor for DREAS Video Resolvers
 * This recursively calls network endpoints according to protobuf instructions
 */
export async function executeVideoResolver(
  manifest: dreas.DREASManifest,
  targetUrl: string,
) {
  if (!manifest || !(manifest as any).videoResolvers) return null;
  const resolversMap = (manifest as any).videoResolvers;
  const resolver = resolversMap[manifest.providerId || "samehadaku"];
  if (!resolver || !resolver.steps || resolver.steps.length === 0) return null;

  let currentPayload = targetUrl;
  let headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  };

  for (const step of resolver.steps) {
    let url = step.endpointUrl.replace("{{target}}", currentPayload);
    
    if (step.headers) {
      Object.assign(headers, step.headers);
    }

    const fetchOpts: RequestInit = {
      method: step.method === 1 ? "POST" : "GET", // 1 = POST in DREASNetworkMethod
      headers,
    };

    if (fetchOpts.method === "POST" && step.bodyPayload) {
       fetchOpts.body = step.bodyPayload.replace("{{target}}", currentPayload);
       if (!headers["Content-Type"]) {
         headers["Content-Type"] = "application/x-www-form-urlencoded";
       }
    }

    try {
      const res = await fetch(url, fetchOpts);
      if (!res.ok) throw new Error(`Resolver HTTP error: ${res.status}`);
      const text = await res.text();

      if (step.extractRegex) {
        const regex = new RegExp(step.extractRegex, "i");
        const match = text.match(regex);
        if (match && match[step.extractRegexGroup || 1]) {
           currentPayload = match[step.extractRegexGroup || 1];
        } else {
           throw new Error("Resolver Regex mismatch");
        }
      } else {
         currentPayload = text;
      }
    } catch (e) {
      console.error("[DREAS Resolver Failed Step]", e);
      return null;
    }
  }

  return currentPayload;
}
