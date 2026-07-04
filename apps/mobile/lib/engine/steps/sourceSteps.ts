import { resolveValue } from "./resolver";

export function executeMapSources(config: any, state: any): any[] {
  const input = resolveValue(config.input, state);
  const format = resolveValue(config.format, state) || "hls";
  const sources: any[] = [];

  if (typeof input === "string") {
    if (input.startsWith("http") || input.startsWith("req_id://"))
      sources.push({
        url: input,
        quality: "Auto",
        type: format,
        provider: "Direct",
      });
  } else if (typeof input === "object" && input !== null) {
    if (input.src)
      sources.push({
        url: input.src,
        quality: "1080p",
        type: format,
        provider: "Direct",
      });
    if (input.src_sd)
      sources.push({
        url: input.src_sd,
        quality: "480p",
        type: format,
        provider: "Direct",
      });
  }
  return sources;
}

export function executeFilterSources(config: any, state: any): any[] {
  const inputs = resolveValue(config.input, state);
  const blacklist = resolveValue(config.blacklist, state) || [];
  const providerPrefix =
    resolveValue(config.provider_prefix, state) || "Direct";

  if (!Array.isArray(inputs)) return [];
  const sources: any[] = [];

  inputs.forEach((url) => {
    if (typeof url !== "string") return;
    const urlLower = url.toLowerCase();
    if (blacklist.some((b: string) => urlLower.includes(b))) return;

    const isDirect =
      urlLower.includes("pixeldrain.com/api/file/") ||
      urlLower.includes("wibufile.com/video") ||
      urlLower.includes("s0.wibufile") ||
      (urlLower.endsWith(".mp4") &&
        !urlLower.includes("/embed") &&
        !urlLower.includes("/view"));
    if (isDirect)
      sources.push({
        provider: providerPrefix,
        quality: "Auto",
        url: url,
        type: "mp4",
      });
  });
  return sources;
}
